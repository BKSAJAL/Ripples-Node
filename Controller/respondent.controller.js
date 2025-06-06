import Survey from "../Model/survey.model.js";
import Response from "../Model/response.model.js";
import Respondent from "../Model/respondent.model.js";
import mongoose from "mongoose";

//Get all respondents for authenticated user
export const getRespondents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    // Find surveys created by this user
    const userSurveyIds = await Survey.find({ user_id: userId }).distinct(
      "_id"
    );

    // Find distinct respondent_ids from responses to those surveys
    const responseData = await Response.aggregate([
      {
        $match: {
          survey_id: {
            $in: userSurveyIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $group: {
          _id: "$respondent_id",
          surveys_completed: { $sum: 1 },
          last_response_at: { $max: "$completed_at" },
        },
      },
      {
        $lookup: {
          from: "respondents",
          localField: "_id",
          foreignField: "_id",
          as: "respondent",
        },
      },
      { $unwind: "$respondent" },
      {
        $match: {
          $or: [
            { "respondent.name": { $regex: search, $options: "i" } },
            { "respondent.email": { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          id: "$_id",
          email: "$respondent.email",
          name: "$respondent.name",
          created_at: "$respondent.created_at",
          surveys_completed: 1,
          last_response_at: 1,
        },
      },
      { $sort: { last_response_at: -1 } },
      { $skip: +skip },
      { $limit: +limit },
    ]);

    // Count total matching documents for pagination
    const totalResponses = await Response.aggregate([
      {
        $match: {
          survey_id: {
            $in: userSurveyIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $group: {
          _id: "$respondent_id",
        },
      },
      {
        $lookup: {
          from: "respondents",
          localField: "_id",
          foreignField: "_id",
          as: "respondent",
        },
      },
      { $unwind: "$respondent" },
      {
        $match: {
          $or: [
            { "respondent.name": { $regex: search, $options: "i" } },
            { "respondent.email": { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $count: "total",
      },
    ]);

    const totalItems = totalResponses[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: {
        respondents: responseData,
        pagination: {
          current_page: +page,
          total_pages: totalPages,
          total_items: totalItems,
          items_per_page: +limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching respondents:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching respondents",
    });
  }
};

// Get detailed information about a specific respondent.
export const getRespondentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: respondentId } = req.params;

    // Fetch the respondent
    const respondent = await Respondent.findById(respondentId);
    if (!respondent) {
      return res.status(404).json({
        success: false,
        message: "Respondent not found",
      });
    }

    // Fetch responses of the respondent to surveys created by this user
    const responses = await Response.find({ respondent_id: respondentId })
      .populate({
        path: "survey_id",
        match: { user_id: userId },
        select: "title",
      })
      .sort({ completed_at: -1 });

    // Filter out responses to surveys not owned by the user
    const filteredResponses = responses
      .filter((r) => r.survey_id !== null)
      .map((r) => ({
        id: r._id,
        survey_id: r.survey_id._id,
        survey_title: r.survey_id.title,
        completed_at: r.completed_at,
      }));

    res.status(200).json({
      success: true,
      data: {
        respondent: {
          id: respondent._id,
          email: respondent.email,
          name: respondent.name,
          metadata: respondent.metadata || {},
          surveys_completed: filteredResponses.length,
          responses: filteredResponses,
          created_at: respondent.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching respondent details:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the respondent",
    });
  }
};

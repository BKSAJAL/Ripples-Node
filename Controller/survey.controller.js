import Survey from "../Model/survey.model.js";
import Response from "../Model/response.model.js";
import Respondent from "../Model/respondent.model.js";

//Get list of surveys
export const getSurveys = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, page = 1, limit = 10 } = req.query;

    const filters = { user_id: userId };

    if (status) filters.status = status;

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [surveys, totalItems] = await Promise.all([
      Survey.find(filters)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Survey.countDocuments(filters),
    ]);

    // Add questions_count and responses_count to each survey
    const surveysWithCounts = await Promise.all(
      surveys.map(async (survey) => {
        const responsesCount = await Response.countDocuments({
          survey_id: survey._id,
        });
        return {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          status: survey.status,
          questions_count: Array.isArray(survey.questions)
            ? survey.questions.length
            : 0,
          responses_count: responsesCount,
          created_at: survey.created_at,
          updated_at: survey.updated_at,
          published_at: survey.published_at || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        surveys: surveysWithCounts,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalItems / limit),
          total_items: totalItems,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching surveys",
    });
  }
};

//Create a new survey
export const createSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description = "", questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Title and valid questions array are required",
      });
    }

    const newSurvey = await Survey.create({
      user_id: userId,
      title,
      description,
      status: "draft",
      questions,
    });

    res.status(201).json({
      success: true,
      message: "Survey created successfully",
      data: {
        survey: {
          id: newSurvey._id,
          title: newSurvey.title,
          description: newSurvey.description,
          status: newSurvey.status,
          questions: newSurvey.questions,
          created_at: newSurvey.created_at,
          updated_at: newSurvey.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the survey",
    });
  }
};

//Get survey by id
export const getSurveyById = async () => {
  try {
    const userId = req.user.id;
    const surveyId = req.params.id;

    const survey = await Survey.findOne({
      _id: surveyId,
      user_id: userId,
    }).lean();

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    const responsesCount = await Response.countDocuments({
      survey_id: survey._id,
    });

    res.status(200).json({
      success: true,
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          status: survey.status,
          questions: survey.questions,
          responses_count: responsesCount,
          created_at: survey.created_at,
          updated_at: survey.updated_at,
          published_at: survey.published_at || null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the survey",
    });
  }
};

//update survey
export const updateSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const surveyId = req.params.id;
    const { title, description = "", questions } = req.body;

    if (!title || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Title and valid questions array are required",
      });
    }

    const survey = await Survey.findOne({ _id: surveyId, user_id: userId });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    survey.title = title;
    survey.description = description;
    survey.questions = questions;
    survey.updated_at = new Date();

    await survey.save();

    res.status(200).json({
      success: true,
      message: "Survey updated successfully",
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          status: survey.status,
          questions: survey.questions,
          updated_at: survey.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the survey",
    });
  }
};

//Delete a survey
export const deleteSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const surveyId = req.params.id;

    const survey = await Survey.findOne({ _id: surveyId, user_id: userId });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    await Survey.deleteOne({ _id: surveyId });

    res.status(200).json({
      success: true,
      message: "Survey deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the survey",
    });
  }
};

//Publish a survey
export const publishSurvey = async (req, res) => {
  try {
    const userId = req.user.id;
    const surveyId = req.params.id;

    const survey = await Survey.findOne({ _id: surveyId, user_id: userId });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    if (survey.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft surveys can be published",
      });
    }

    survey.status = "active";
    survey.published_at = new Date();
    survey.updated_at = new Date();

    await survey.save();

    res.status(200).json({
      success: true,
      message: "Survey published successfully",
      data: {
        survey: {
          id: survey._id,
          status: survey.status,
          published_at: survey.published_at,
        },
      },
    });
  } catch (error) {
    console.error("Error publishing survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while publishing the survey",
    });
  }
};

//Get public survey
export const getPublicSurvey = async (req, res) => {
  try {
    const surveyId = req.params.id;

    const survey = await Survey.findOne({ _id: surveyId, status: "active" });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found or not public",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        survey: {
          id: survey._id,
          title: survey.title,
          description: survey.description,
          questions: survey.questions,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching public survey:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the survey",
    });
  }
};

//Submit a survey response
export const submitSurveyResponse = async (req, res) => {
  try {
    const surveyId = req.params.id;
    const { respondent, answers } = req.body;

    // Check if survey is active
    const survey = await Survey.findOne({ _id: surveyId, status: "active" });
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found or not accepting responses",
      });
    }

    // Create or find respondent
    let respondentDoc = null;
    if (respondent?.email) {
      respondentDoc = await Respondent.findOneAndUpdate(
        { email: respondent.email },
        {
          $set: {
            name: respondent.name || "",
            updated_at: new Date(),
          },
          $setOnInsert: {
            created_at: new Date(),
          },
        },
        { new: true, upsert: true }
      );
    } else {
      respondentDoc = await new Respondent({
        email: respondent?.email || "",
        name: respondent?.name || "",
        created_at: new Date(),
        updated_at: new Date(),
      }).save();
    }

    // Save response
    const responseDoc = await new Response({
      survey_id: surveyId,
      respondent_id: respondentDoc._id,
      answers,
      completed_at: new Date(),
      ip_address: req.ip,
      user_agent: req.headers["user-agent"] || "",
    }).save();

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      data: {
        response_id: responseDoc._id,
      },
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the response",
    });
  }
};

//Get all responses for a survey
export const getSurveyResponses = async (req, res) => {
  try {
    const surveyId = req.params.id;
    const userId = req.user.id; // comes from your auth middleware

    // Confirm ownership of survey
    const survey = await Survey.findOne({ _id: surveyId, user_id: userId });
    if (!survey) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access responses for this survey",
      });
    }

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch responses with respondent info
    const [responses, totalItems] = await Promise.all([
      Response.find({ survey_id: surveyId })
        .populate("respondent_id", "email name") // returns respondent subdoc
        .sort({ completed_at: -1 })
        .skip(skip)
        .limit(limit),
      Response.countDocuments({ survey_id: surveyId }),
    ]);

    // Format results
    const formattedResponses = responses.map((resp) => ({
      id: resp._id,
      respondent: resp.respondent_id
        ? {
            id: resp.respondent_id._id,
            email: resp.respondent_id.email,
            name: resp.respondent_id.name,
          }
        : null,
      answers: resp.answers,
      completed_at: resp.completed_at,
    }));

    // Send response
    res.status(200).json({
      success: true,
      data: {
        responses: formattedResponses,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(totalItems / limit),
          total_items: totalItems,
          items_per_page: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching responses",
    });
  }
};

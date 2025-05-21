# 🛒 ShoppyGlobe - Backend

Welcome to the backend of **ShoppyGlobe**, a simple e-commerce API built with Node.js. This backend supports functionality for products, users, and shopping carts.

### 👨‍💻 Author

**Sajal Bansal**
Happy coding and thanks for checking out the project! 😊

---

## 🚀 Project Setup

### GitHub Repository

[https://github.com/BKSAJAL/ShoppyGlobe-Backend](https://github.com/BKSAJAL/ShoppyGlobe-Backend)

Clone the repo and set up the project in a few simple steps:

```bash
git clone <https://github.com/BKSAJAL/ShoppyGlobe-Backend.git>
git clone <your-git-link>
cd shoppyglobe-backend
npm install
npm start
```

✅ Now you’re ready to make API calls.

---

## 🔗 Base URL

```
http://localhost:3000
```

---

## 📦 Product APIs

| Route                     | Method | Description       |
| ------------------------- | ------ | ----------------- |
| `/v1/products`            | GET    | Get all products  |
| `/v1/products/:id`        | GET    | Get product by ID |
| `/v1/products/addProduct` | POST   | Add a new product |

**Request body for adding product**:

```json
{
  "name": "Product Name",
  "price": 100,
  "description": "Product Description",
  "stockQuantity": 20
}
```

---

## 👤 User APIs

| Route               | Method | Description                   |
| ------------------- | ------ | ----------------------------- |
| `/v1/user/register` | POST   | Register a new user           |
| `/v1/user/login`    | POST   | Log in a user (returns token) |

**Request body** (for both routes):

```json
{
  "username": "yourUsername",
  "password": "yourPassword"
}
```

⚠️ **Note:** On successful login, a **JWT token** is returned. This token is required for all cart-related routes and must be sent in the `Authorization` header as:

```
Authorization: Bearer <your_token>
```

🔐 Token is valid for **1 hour**.

---

## 🛒 Cart APIs

| Route                         | Method | Description                     |
| ----------------------------- | ------ | ------------------------------- |
| `/v1/cart/addToCart`          | POST   | Add a product to the cart       |
| `/v1/cart/updateQuantity/:id` | PUT    | Update product quantity in cart |
| `/v1/cart/delete/:id`         | DELETE | Delete product from the cart    |

> 🔐 **All Cart APIs require a valid JWT token in the Authorization header.**

---

### 🔹 Add to Cart

**Endpoint**:

```
POST /v1/cart/addToCart
```

**Request body**:

```json
{
  "_id": "productId",
  "quantity": 2
}
```

**Notes**:

* `_id` must be a valid product ID from the **products collection**.
* `quantity` must be **greater than 0**.

---

### 🔹 Update Quantity in Cart

**Endpoint**:

```
PUT /v1/cart/updateQuantity/:id
```

**Request body**:

```json
{
  "quantity": -1
}
```

**Notes**:

* `:id` must be a valid **cart item ID**.
* `quantity` can be a **positive or negative number** (for increment or decrement).
* However, after applying the update, the total quantity in the cart **must remain greater than 0**. Updates leading to zero or negative quantity are **not allowed**.

---

### 🔹 Delete Product from Cart

**Endpoint**:

```
DELETE /v1/cart/delete/:id
```

**Notes**:

* `:id` must be a valid **cart item ID** that exists in the cart.

---

### 👨‍💻 Author's Note

Thank you for exploring **ShoppyGlobe - Backend**!
I hope this project helps you learn, build, or launch something awesome.
If you have feedback, ideas, or just want to say hi — feel free to connect!
Happy coding and stay curious. 🚀😊


![Under Development](https://img.shields.io/badge/status-under_development-yellow)


# 📺 VideoTube Backend

A Node.js + Express.js backend API for a video sharing platform. This project handles user authentication, video uploads, subscriptions, and more. Built with MongoDB, Cloudinary, JWT, and secure cookie/token management.

---

## 🚀 Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Access Token & Refresh Token Handling with Secure Cookies
- ✅ Upload Videos/Thumbnails to Cloudinary using Multer
- ✅ Subscribe/Unsubscribe to Channels
- ✅ Get Channel Info & Subscriber Count (MongoDB Aggregation)
- ✅ Route Protection via Middleware
- ✅ RESTful API Design
- ✅ MongoDB + Mongoose for Data Management

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Cloudinary** (for image/video hosting)
- **JWT** for authentication
- **Multer** for file uploads
- **Cookie-Parser** for secure token storage
- **dotenv** for environment configuration

---

## 📁 Folder Structure

```
videoTube-backend/
├── controllers/
├── routes/
├── middlewares/
├── models/
├── config/
├── utils/
├── uploads/ (optional local storage)
├── .env
└── app.js / server.js
```

---

## 🔐 Authentication Workflow

- On login:
  - Access Token (short-lived) is returned in response.
  - Refresh Token is stored in **HTTP-only cookie**.
- Middleware checks tokens to protect private routes.

---

## ☁️ Image & Video Upload

- Uses **Multer** to handle multipart file uploads.
- Uploads files directly to **Cloudinary** and stores returned URLs in MongoDB.

---

## 📊 MongoDB Aggregation

Example aggregations used:

- Get total subscribers of a channel.
- Fetch channel data along with joined metadata.

---

### 📪 API Endpoints Overview

Base route: `/api/v1/users`

| Method | Endpoint              | Description                                   |
| ------ | --------------------- | --------------------------------------------- |
| POST   | `/login`              | Log in user and return access/refresh token   |
| POST   | `/logout`             | Log out user and clear tokens                 |
| POST   | `/refresh-token`      | Refresh the access token using refresh token  |
| GET    | `/current-user`       | Get details of the currently logged-in user   |
| POST   | `/change-password`    | Change current user's password                |
| PATCH  | `/update-details`     | Update partial user details (name, bio, etc.) |
| POST   | `/update-avatar`      | Upload and update user avatar image           |
| POST   | `/update-cover-image` | Upload and update cover image                 |
| GET    | `/channel/:username`  | Get channel details by username               |
| GET    | `/watch-history`      | Fetch user’s video watch history              |

> All protected routes require a valid access token in headers or cookies.

---

## ⚙️ Setup Instructions

```bash
# Clone the repo
git clone https://github.com/hasnainsheikh15/videoTube-backend.git
cd videoTube-backend

# Install dependencies
npm install

# Create a .env file and add the following:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Start the server
npm run dev
```

---

## 🌐 Deployment Suggestions

- Host backend on **Render**, **Railway**, **Heroku**, or **VPS**.
- Use **MongoDB Atlas** for cloud database.
- Use **Cloudinary** for media storage.

---

## 📌 Future Enhancements

This project is actively being developed and new features will be added soon, including:

- ✅ API Pagination
- ✅ Admin panel with RBAC
- ⏳ Rate limiting with express-rate-limit
- ⏳ API documentation (Swagger/Postman)
- ⏳ Integration tests using Jest/Supertest
- And many more improvements!

---

## 👨‍💻 Author

**Hasnain Sheikh**  
Cybersecurity Student | Backend Developer  
[GitHub Profile](https://github.com/hasnainsheikh15)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

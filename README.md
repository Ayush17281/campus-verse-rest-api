# Campus Verse 🎓

A college posting platform built while learning **React, Vite, Node.js, Express.js, REST APIs, and MySQL**.

Students can create posts to share their college-related thoughts, experiences, and opinions.

## 🚀 Live Demo

Try the deployed application:

**Frontend:** https://campus-verse-frontend.vercel.app/

**Backend:** https://campus-verse-rest-api.onrender.com

> The backend may take 2–3 minutes to start if Render has temporarily put the service to sleep. Screenshots of the application are provided below.

## 📸 Screenshots

### Posts
![Posts](screenshots/Front-Page-UI.png)

### Create Post
![Create Post](screenshots/Share-A-post.png)

### Edit/Delete Your Post
![Edit Post](screenshots/Edit-Delete_your_own_post.png)

### Login to Participate in Discussions
![Login](screenshots/log-in.png)

### Search Latest Tech News
![Tech Articles](screenshots/Tech-Articals-PublicAPI.png)

## 🛠️ Tech Stack

* React
* Vite
* Node.js
* Express.js
* REST APIs
* MySQL
* Axios
* EJS
* Aiven — Cloud MySQL
* Render — Backend Deployment
* Vercel — Frontend Deployment
* Git & GitHub

## ✨ Features

* Create and view posts
* Edit and delete your own posts
* User signup and login
* Anonymous usernames for posts
* UUID-based post IDs
* Created and updated timestamps
* MySQL database persistence
* Tech news integration using a public API
* Cloud database integration
* Deployed React frontend and Express backend

## 🔌 Routes

### React REST API

```text
GET     /api/me          → Check logged-in user
POST    /api/signup      → Register a user
POST    /api/login       → Log in
POST    /api/logout      → Log out
GET     /api/posts       → Fetch all posts
POST    /api/posts       → Create a post
PUT     /api/posts/:id   → Update your own post
DELETE  /api/posts/:id   → Delete your own post
GET     /api/tech-news   → Fetch latest tech news
```

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Ayush17281/campus-verse-rest-api.git
```

### 2. Go to the project folder

```bash
cd campus-verse-rest-api
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Set up MySQL

Create a MySQL database and run the `schema.sql` file to create the required tables.

### 5. Create `.env`

Add your MySQL connection details and session secret:

```env
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database_name
SESSION_SECRET=your_random_secret
```

Never commit your `.env` file or expose your database credentials.

### 6. Start the backend

```bash
npm start
```

The backend runs at:

http://localhost:8080/

### 7. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite development URL shown in the terminal, usually:

http://localhost:5173/

## 📚 What I Learned

* React components, state, and effects
* Building a frontend with Vite
* Express routing and middleware
* REST APIs and CRUD operations
* User authentication and sessions
* MySQL integration
* UUIDs and parameterized queries
* Environment variables
* Git and GitHub collaboration
* Cloud deployment with **Vercel, Render, and Aiven**

> A project built as part of my full-stack development learning journey.

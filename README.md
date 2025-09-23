# ⚙️ DevTinder Backend

This is the **backend service** of [DevTinder](https://devtinder-chi.vercel.app/), a developer networking platform where tech enthusiasts can **connect and chat** based on mutual interests.

The backend provides **REST APIs, authentication, real-time chat, and database management**, built with **Node.js, Express, MongoDB, and Socket.IO**.

## 🛠️ Tech Stack

- **Node.js + Express.js** – REST API & server-side logic
- **MongoDB (Mongoose)** – NoSQL database for scalable data handling
- **JWT Authentication** – Secure login & signup
- **Socket.IO** – Real-time chat
- **CORS + Cookie Parser** – Secure session management

## 🔥 Core Features

- 👤 User Authentication – Signup & login with JWT tokens
- ❤️ Match System – Connect with developers
- 💬 Real-time Chat – Powered by Socket.IO
- 📄 Pagination – Efficient feed loading (10 users at a time)
- 🔒 Protected Routes – Secure API with middleware

## 🚀 Getting Started (Backend)

Follow these steps to run the **backend** locally:

### 1️⃣ Clone the Repository:

```bash
git clone https://github.com/work-saddam/devTinder.git
cd devTinder
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a .env file in the root directory:

```
PORT=XXXX
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run the Server

```bash
npm run dev
```

## 🔗 Related

- 🎨 Frontend Repo → [devTinder-web](https://github.com/work-saddam/devTinder-web)

- 🌐 Live Demo → [DevTinder App](https://devtinder-chi.vercel.app/)

## 🔗 Connect

👨‍💻 Open to collaborations and feedback! Feel free to connect with me:

- [LinkedIn Profile](https://www.linkedin.com/in/saddam-hussein786/)
- [GitHub Profile](https://github.com/work-saddam)

_🌟 Feedback and contributions are welcome! Feel free to fork the project or raise an issue._

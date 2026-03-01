🚀 AI-Powered Real-Time Chat Application
Full Stack MERN + Vector Memory + Real-Time Architecture

A production-style AI-powered real-time chat application built using:

⚛ React (Vite) + Redux Toolkit

🌐 Node.js + Express

🗄 MongoDB

🔐 JWT Authentication

⚡ Socket.io (real-time communication)

🧠 Pinecone (Vector Database for long-form memory)

🤖 Google GenAI SDK

This application supports secure authentication, real-time messaging, AI-powered responses, and long-term conversational memory using vector embeddings.

📌 Project Overview

This project demonstrates:

Full-stack MERN architecture

Secure authentication & protected routes

Real-time bidirectional communication

AI integration with contextual memory

Hybrid storage (MongoDB + Vector DB)

Scalable and modular backend architecture

The system maintains conversation continuity by storing semantic embeddings in Pinecone and retrieving relevant past context during AI generation.

🏗️ System Architecture
Frontend (React + Redux + Socket.io Client)
            ↓
Backend (Express + JWT + Socket.io Server)
            ↓
MongoDB (Structured Data)
            +
Pinecone (Vector Memory Storage)
            ↓
Google GenAI (Response Generation)
🎨 Frontend (React + Vite)

Built using React 19 with Vite for high-performance development.

🚀 Technologies

React 19

Vite

Redux Toolkit

React Redux

React Router DOM

Axios

Socket.io Client

⚡ Features

Component-based architecture

Centralized global state (Redux Toolkit)

Protected routes

JWT token handling

Axios interceptors

Real-time chat updates via Socket.io

Clean scalable folder structure

🌐 Development Server

Runs on:

http://localhost:5173

Start with:

npm run dev

⚙️ Backend (Node.js + Express)

The backend follows a modular MVC-style architecture and handles:

Authentication

AI processing

Vector memory storage

Real-time messaging

🚀 Technologies

Node.js

Express.js

MongoDB + Mongoose

JWT (jsonwebtoken)

bcryptjs

Socket.io

Pinecone (Vector DB)

Google GenAI SDK

dotenv

CORS

cookie-parser

🔐 Authentication & Authorization

Password hashing using bcrypt

JWT token generation on login

Custom authentication middleware

Protected API routes

Secure environment variable handling

⚡ Real-Time Messaging (Socket.io)

The backend uses Socket.io for live communication.

Flow:

Client connects to socket

User sends message

Backend processes message

Context retrieved from Pinecone

AI generates enriched response

Response emitted back to client instantly

This enables:

Instant chat updates

AI streaming-style interaction

Real-time UX

🧠 Long-Form AI Memory (Pinecone)

The application uses Pinecone as a vector database to maintain conversational memory.

How It Works

Messages are converted into embeddings

Embeddings are stored in Pinecone

Similar past context is retrieved during new queries

Retrieved memory is injected into AI prompt

AI produces context-aware responses

Why Pinecone?

Efficient similarity search

Scalable vector indexing

Enables semantic recall

Supports long-form contextual conversations

🤖 AI Integration (Google GenAI)

The backend integrates Google GenAI SDK to:

Generate AI responses

Process contextual prompts

Produce intelligent replies

AI responses are enhanced using retrieved vector memory before being returned to the client.

🗄️ Hybrid Storage Architecture
Storage	Purpose
MongoDB	Users, chats, structured data
Pinecone	Vector embeddings for semantic memory

This combination enables both structured persistence and contextual AI recall.

🔧 Installation & Setup

1️⃣ Clone Repository
git clone https://github.com/your-username/project-name.git
cd project-name

2️⃣ Backend Setup
cd Backend
npm install

Create .env:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PINECONE_API_KEY=your_key
GOOGLE_API_KEY=your_key

Start backend:

npm run dev

Runs on:

http://localhost:3000
3️⃣ Frontend Setup
cd Frontend
npm install
npm run dev

Runs on:

http://localhost:5173
🔥 Key Highlights

Full-stack MERN architecture

JWT-secured authentication

Real-time WebSocket communication

AI-powered contextual responses

Long-form vector memory storage

Scalable modular backend design

Production-style architecture


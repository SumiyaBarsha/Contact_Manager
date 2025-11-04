# 📇 MyContacts Backend API

A Node.js + Express.js RESTful API for managing user accounts and contacts, featuring JWT-based authentication, refresh tokens, MongoDB (Mongoose) for database operations, and robust error handling middleware.

## 🚀 Features

### 🔐 User Authentication System

- Register, login, logout
- Access & refresh token support
- Protected routes with middleware

### 👥 Contact Management
- Create, read, update, and delete contacts
- Each contact associated with a logged-in user
- Full CRUD operations secured by JWT

### ⚙️ API Design
- Modular routes, controllers, and middleware
- Global error handler
- Asynchronous operations using express-async-handler

### 🧱 Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- dotenv 

### 🧩 API Endpoints
#### Auth Routes
- POST	  /api/users/register	
- POST	  /api/users/login	
- POST	  /api/users/refresh	
- POST	  /api/users/logout	
- GET	    /api/users/current	


#### Contact Routes
- POST	  /api/contacts/create	
- GET	    /api/contacts/
- GET     /api/contacts/:id
- PUT	    /api/contacts/update/:id	
- DELETE	/api/contacts/delete/:id	

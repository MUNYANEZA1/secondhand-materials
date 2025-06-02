# README.md - Second-hand Materials System with MongoDB

## Project Overview

This is a complete implementation of the Second-hand Materials System for INES-Ruhengeri, built with MongoDB as the database. The system allows students and staff to buy and sell second-hand items within the campus community.

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (replacing MySQL)
- JWT for authentication
- Multer for file uploads

### Frontend
- React.js (JavaScript)
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Vite as the build tool

## Features

- User authentication (register, login, profile management)
- Item listings (create, view, edit, delete)
- Item search and filtering
- Messaging between users
- Admin dashboard for content moderation
- Report system for inappropriate content
- Responsive design for all devices

## Project Structure

### Backend Structure
```
backend/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── utils/          # Utility functions
├── uploads/        # Uploaded files
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── package.json    # Dependencies and scripts
└── server.js       # Entry point
```

### Frontend Structure
```
frontend/
├── public/         # Static files
├── src/
│   ├── assets/     # Images and other assets
│   ├── components/ # React components
│   ├── context/    # Context providers
│   ├── hooks/      # Custom hooks
│   ├── pages/      # Page components
│   ├── services/   # API services
│   ├── utils/      # Utility functions
│   ├── App.jsx     # Main component
│   ├── index.css   # Global styles
│   └── main.jsx    # Entry point
├── .env            # Environment variables
├── index.html      # HTML template
├── package.json    # Dependencies and scripts
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js  # Vite configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the backend directory (see `.env.example`)
   - Create a `.env` file in the frontend directory (see `.env.example`)

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```
3. Access the application at `http://localhost:5173`

## API Documentation

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/photo` - Upload profile photo

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `PUT /api/items/:id/status` - Update item status
- `PUT /api/items/:id/photos` - Upload item photos
- `GET /api/items/user/:userId` - Get items by user
- `GET /api/items/category/:category` - Get items by category
- `GET /api/items/search` - Search items

### Messages
- `GET /api/conversations` - Get user conversations
- `GET /api/conversations/:id` - Get conversation by ID
- `POST /api/conversations` - Create a new conversation
- `GET /api/messages/conversation/:conversationId` - Get messages by conversation
- `POST /api/messages` - Send a message

### Reports
- `GET /api/reports` - Get all reports (admin only)
- `POST /api/reports` - Create a report
- `PUT /api/reports/:id` - Update report status (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/items/pending` - Get pending items
- `PUT /api/admin/items/:id/approve` - Approve item
- `PUT /api/admin/items/:id/reject` - Reject item

## Deployment

### Backend
1. Set `NODE_ENV=production` in the `.env` file
2. Build the application:
   ```
   npm run build
   ```
3. Start the server:
   ```
   npm start
   ```

### Frontend
1. Build the application:
   ```
   npm run build
   ```
2. Deploy the contents of the `dist` directory to a web server

## License

This project is licensed under the MIT License.

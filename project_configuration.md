# MongoDB Project Configuration

This file contains the configuration for the MongoDB-based Second-hand Materials System project.

## Frontend Configuration

The frontend is built with React.js using JavaScript (not TypeScript) and includes the following configuration files:

- `package.json`: Defines project dependencies and scripts
- `vite.config.js`: Configuration for Vite build tool
- `tailwind.config.js`: Configuration for Tailwind CSS
- `postcss.config.js`: Configuration for PostCSS
- `.env`: Environment variables for the frontend

## Backend Configuration

The backend is built with Node.js, Express, and MongoDB and includes the following configuration files:

- `package.json`: Defines project dependencies and scripts
- `.env`: Environment variables for the backend
- `config/db.js`: MongoDB connection configuration

## Environment Variables

### Backend Environment Variables
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/secondhand-materials
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=1000000
```

### Frontend Environment Variables
```
VITE_API_URL=/api
```

## Setup Instructions

1. Install MongoDB locally or use MongoDB Atlas
2. Clone the repository
3. Install backend dependencies: `cd backend && npm install`
4. Install frontend dependencies: `cd frontend && npm install`
5. Set up environment variables in `.env` files
6. Start the backend: `cd backend && npm run dev`
7. Start the frontend: `cd frontend && npm run dev`

## Build Instructions

### Backend
```
cd backend
npm run build
```

### Frontend
```
cd frontend
npm run build
```

## Deployment

The project can be deployed to any hosting service that supports Node.js and MongoDB. For production deployment, make sure to:

1. Set `NODE_ENV=production` in the backend `.env` file
2. Configure a production MongoDB URI
3. Set a strong JWT secret
4. Build the frontend and serve it as static files from the backend or a CDN

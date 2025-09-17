# Director Story Showcase 

 A full-stack application for uploading and managing multimedia stories. It includes a Node.js/Express backend with MongoDB for data storage and a React frontend for user interaction.

## Features

- User registration and login (roles: director, producer)
- Upload stories with media files (video, audio, PDF)
- Story metadata including title, description, genres, and director info
- File upload handling with Multer and file type validation
- Story listing with director details
- Profile update functionality
- Secure password storage (note: currently passwords are stored in plain text, should be hashed in production)
- CORS enabled for frontend-backend communication

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, Multer
- Frontend: React, TypeScript, React Router
- Authentication: Session storage for user state
- File storage: Local filesystem under `/uploads`

## Setup Instructions

### Backend

1. Navigate to the server directory:
   ```
   cd 2300p/Sakthi/project/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3001
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the frontend directory (assumed to be `2300p/Sakthi/project`):
   ```
   cd 2300p/Sakthi/project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port your frontend runs on).

## Demo

https://github.com/user-attachments/assets/6adbc586-adb1-4578-849d-0186610cf489

## Usage

- Register as a director or producer.
- Login with your credentials.
- Navigate to the "Add Story" page to upload a new story with media.
- View stories on the dashboard.

## Notes

- Media files are stored locally in the `server/uploads` directory.
- The backend server runs on port 3001; the frontend communicates with it accordingly.
- Passwords are currently stored in plain text for simplicity; consider using hashing (e.g., bcrypt) for production.
- The project includes basic validation and error handling; further improvements can be made for security and UX.

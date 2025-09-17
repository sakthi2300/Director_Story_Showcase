// To run the server, use: npm start or node server.js
const mongoose = require('mongoose');
const connectDB = require('./db');         // MongoDB connection file
const User = require('./models/User');     // User schema
const Story = require('./models/Story');   // Story schema
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize MongoDB connection
connectDB();

// Enable CORS for all routes
app.use(cors());

// Serve static files from uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
}, express.static(uploadsDir));

// Parse JSON bodies
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, uniqueId + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = {
            'video': ['video/mp4', 'video/webm', 'video/ogg'],
            'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg'],
            'pdf': ['application/pdf']
        };
        const mediaType = req.body.mediaType;
        if (!mediaType || !allowedTypes[mediaType]) {
            return cb(new Error('Invalid media type'));
        }
        if (allowedTypes[mediaType].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${mediaType}`));
        }
    }
});

// ---------------------- Registration ----------------------
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, phone, role, password } = req.body;
        if (!name || !email || !phone || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            phone,
            role,
            password // In production, hash the password!
        });
        await newUser.save();
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// ---------------------- Login ----------------------
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

// ---------------------- Update Profile ----------------------
app.put('/api/profile', async (req, res) => {
    try {
        const { id, name, phone, bio } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;
        await user.save();
        const { password: _, ...updatedUser } = user.toObject();
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
});

// ---------------------- Fetch Stories ----------------------
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await Story.find().populate('directorId', 'name email phone bio');
        const response = stories.map(story => ({
            ...story.toObject(),
            director: story.directorId
        }));
        res.json(response);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories', details: error.message });
    }
});

// ---------------------- Upload Story ----------------------
app.post('/api/stories', upload.single('media'), async (req, res) => {
    try {
        console.log('Received body:', req.body);
        console.log('Received file:', req.file);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { title, description, mediaType, genres, directorId } = req.body;
        console.log('Parsed fields:', { title, description, mediaType, genres, directorId });
        if (!title || !description || !mediaType || !genres || !directorId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Validate directorId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(directorId)) {
            console.log('Invalid directorId:', directorId);
            return res.status(400).json({ error: 'Invalid directorId' });
        }
        // Safely parse genres
        let parsedGenres;
        try {
            parsedGenres = JSON.parse(genres);
            console.log('Parsed genres:', parsedGenres);
        } catch (error) {
            console.log('Failed to parse genres:', genres);
            return res.status(400).json({ error: 'Invalid genres format' });
        }
        const newStory = new Story({
            title,
            description,
            mediaType,
            mediaUrl: `/uploads/${req.file.filename}`,
            genres: parsedGenres,
            directorId
        });
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        console.error('Error uploading story:', error);
        console.error(error.stack);
        res.status(500).json({ error: 'Failed to upload story', details: error.message });
    }
});

// ---------------------- Delete Story ----------------------
app.delete('/api/stories/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        const filePath = path.join(__dirname, story.mediaUrl.replace('/uploads/', ''));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await story.remove();
        res.json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ error: 'Failed to delete story', details: error.message });
    }
});

// ---------------------- Health Check ----------------------
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// ---------------------- Error Handling ----------------------
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum size is 100MB' });
        }
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ---------------------- Start Server ----------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

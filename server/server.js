const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from uploads directory with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Parse JSON bodies
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Configure multer for file upload
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
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
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
      cb(new Error(`Invalid file type. Allowed types for ${mediaType}: ${allowedTypes[mediaType].join(', ')}`));
    }
  }
});

// Store stories in memory (in a real app, use a database)
const stories = [];

// Store users in memory and persist to file
const usersFile = path.join(dataDir, 'users.json');
let users = [];

// Load users from file if it exists
try {
  if (fs.existsSync(usersFile)) {
    const usersData = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(usersData);
  }
} catch (error) {
  console.error('Error loading users:', error);
}

// Function to save users to file
const saveUsers = async () => {
  try {
    await fs.promises.writeFile(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// GET endpoint to fetch all stories
app.get('/api/stories', (req, res) => {
  try {
    // Map stories to include director information
    const storiesWithDirectors = stories.map(story => {
      const director = users.find(user => user.id === story.directorId);
      return {
        ...story,
        director: director ? {
          id: director.id,
          name: director.name,
          email: director.email,
          phone: director.phone,
          bio: director.bio || ''
        } : null
      };
    });
    
    console.log('Fetching stories:', storiesWithDirectors);
    res.json(storiesWithDirectors);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stories',
      details: error.message 
    });
  }
});

// DELETE endpoint for stories
app.delete('/api/stories/:id', (req, res) => {
  try {
    const storyId = req.params.id;
    const storyIndex = stories.findIndex(s => s.id === storyId);
    
    if (storyIndex === -1) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Get the story to delete
    const story = stories[storyIndex];
    
    // Delete the file from the uploads directory
    const filePath = path.join(__dirname, story.mediaUrl.replace('/uploads/', ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the story from the array
    stories.splice(storyIndex, 1);
    
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ 
      error: 'Failed to delete story',
      details: error.message 
    });
  }
});

// API endpoint for story upload
app.post('/api/stories', upload.single('media'), (req, res) => {
  try {
    console.log('Received upload request:', {
      body: req.body,
      file: req.file
    });

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.body.title || !req.body.description || !req.body.mediaType || !req.body.genres || !req.body.directorId || !req.body.directorName || !req.body.directorEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const story = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      mediaType: req.body.mediaType,
      mediaUrl: `/uploads/${req.file.filename}`,
      genres: JSON.parse(req.body.genres),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      directorId: req.body.directorId,
      director: {
        id: req.body.directorId,
        name: req.body.directorName,
        email: req.body.directorEmail,
        phone: req.body.directorPhone || '',
        bio: req.body.directorBio || ''
      }
    };

    stories.push(story);
    console.log('Story created successfully:', story);
    res.status(201).json(story);
  } catch (error) {
    console.error('Error uploading story:', error);
    res.status(500).json({ 
      error: 'Failed to upload story',
      details: error.message 
    });
  }
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    // Basic validation
    if (!name || !email || !phone || !role || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      password // In a real app, this should be hashed
    };

    users.push(newUser);
    saveUsers(); // Save users to file
    console.log('User registered successfully:', { ...newUser, password: '[REDACTED]' });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Read existing users
    let users = [];
    try {
      const data = await fs.promises.readFile(usersFile, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, start with empty array
      users = [];
    }

    // Find user by email
    let user = users.find(u => u.email === email);

    // If user doesn't exist, create a new user
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0], // Use part before @ as name
        email,
        phone: '',
        role: role || 'director', // Default to director if role not specified
        password: password || 'demo123', // Use provided password or default
        bio: ''
      };
      users.push(user);
      
      // Save users to file
      await fs.promises.writeFile(usersFile, JSON.stringify(users, null, 2));
    }

    // Ensure the role matches what was requested
    if (role && user.role !== role) {
      user.role = role;
      // Update the user in the users array
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        users[userIndex] = user;
        await fs.promises.writeFile(usersFile, JSON.stringify(users, null, 2));
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    console.log('Sending user data:', userWithoutPassword); // Add logging
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile endpoint
app.put('/api/profile', async (req, res) => {
  try {
    const { id, name, phone, bio } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Read existing users
    let users = [];
    try {
      const data = await fs.promises.readFile(usersFile, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
      return res.status(500).json({ error: 'Failed to read users data' });
    }

    // Find user by ID
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      phone: phone || users[userIndex].phone,
      bio: bio || users[userIndex].bio
    };

    // Save updated users to file
    try {
      await fs.promises.writeFile(usersFile, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error saving updated users:', error);
      return res.status(500).json({ error: 'Failed to save profile updates' });
    }

    // Return updated user data without password
    const { password: _, ...updatedUser } = users[userIndex];
    console.log('Profile updated successfully:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 100MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 
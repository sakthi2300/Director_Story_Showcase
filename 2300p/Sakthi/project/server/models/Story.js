

const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaType: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    genres: [{ type: String }],
    directorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Story', storySchema);

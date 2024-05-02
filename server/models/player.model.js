const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "First name is required"],
        minlength: [3, "First name must be at least 3 characters long"],
    },
    position: {
        type: String,
        required: [true, "Last name is required"],
    },
    games: {
        type: [String],
        required: false
    },

    userId: {
        type: String,
        required: true
    }
    
}, { timestamps: true });

module.exports.PlayerModel = mongoose.model('Player', PlayerSchema);

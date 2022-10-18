const { Schema, model } = require("mongoose");

const feedback = new Schema({
    name: String,
    text: String,
    // phone: String,
    createdAt: { 
        type: Date,
        default: Date.now(),
    },
    status: {
        type: Number,
        default: 0,
    },
});

module.exports = model("Feedback", feedback);

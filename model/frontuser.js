const { Schema, model } = require("mongoose");
const frontusers = new Schema({
        login: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: Array,
        },
        password: {
            type: String,
            require: true,
        },
        email: String,
        img: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        
});

module.exports = model("Frontusers", frontusers);

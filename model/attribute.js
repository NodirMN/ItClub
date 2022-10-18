const { Schema, model } = require("mongoose");


const attribute = new Schema({
    title: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    order: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 0,
    },
});


module.exports = model("Attribute", attribute);

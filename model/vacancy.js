const { Schema, model } = require("mongoose");

const vacancy = new Schema({
    property: String,
    name: String,
    // phone: String,
    text:String,
    order:String,
    createdAt: {
            type: Date,
            default: Date.now(),   
        },
        status: {
            type: Number,
            default: 0,
        },
    condi:[{
        name:String,
        sname:String,
        fname:String,
        // phone:String,
        file:String,
        // email:String,

        textarea:String,
        createdAt: {
            type: Date,
            default: Date.now(),
        },  
        status: {
            type: Number,
            default: 0,
        },
    }],
});

module.exports = model("Vacancy", vacancy);

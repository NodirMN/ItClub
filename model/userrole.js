const { Schema, model } = require("mongoose");

const userrole = new Schema({
    value:{
        type:String,
        unique:true,
        default:'USER',
    }
});

module.exports = model("Userrole", userrole);  

const {Schema,model} = require('mongoose')


const news = new Schema({
    title:String,
    text:String,
    photo:String,
    views:{
        type:Number,
        default:0,
    },
    status: {
        type:Number,
        default:1
    },
    createdAt:Date

})

module.exports= model('News',news)
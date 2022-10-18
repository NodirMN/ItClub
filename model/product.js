const {Schema,model} = require('mongoose');

const product = new Schema({
    title: {
        type: String,
        require: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    newpro:{
        type:Number,
        default:0
    },
    author: String,
    desc: String,
    order:String,
    hot: {
        type: Number,
        default: 0,
    },
    createdAt: {
            type:Date,
            default:Date.now()
        },
    price: {
        type: Number,
        default: 0,
    },
    sale:Number,
    views:Number,
    status: {
        type: Number,
        default: 0,
    },
    text: {
        type: String,
        default: "",
    },
    photos: [String],
    attribute:[
        {
            attribute:{
                type:Schema.Types.ObjectId,
                ref:'Attribute'
            },
            value:String,
        }
    ],
    
    rate: [
        {
        name: String,
        rate: Number,
        title:String,
        text: String,
        createdAt: {
            type:Date,
            default:Date.now()
        },
        mark:{
            Number,
            default:0,
    }
        },
    ],
});



module.exports = model('Product',product)
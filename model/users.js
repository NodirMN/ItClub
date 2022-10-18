const {Schema,model} = require('mongoose');

const users = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: Array,
  },
  resetToken: String,
  resetTokenExp: Date,
  password: {
    type: String,
    require: true,
  },
  email: String,
  img: String,
  roles:[{
    type:String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = model('Users',users)



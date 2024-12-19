const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
roleName:{
    type:String,
    required:true,
},
timestamp:{
    type:Date,
    default:Date.now
}
});
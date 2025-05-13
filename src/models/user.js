const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type:String,
        enum : {
            values : ["male","female","others"],
            message : '{VALUE} gender type is not valid'
        }
    },
    photoUrl : {
        type : String,
        default : 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'
    },
    about : {
        type : String,
        default : 'this is a default about for the user'
    },
    skills : {
        type : [String]
    }
},
{timestamps:true});

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;

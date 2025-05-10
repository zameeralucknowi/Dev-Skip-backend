const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type:mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status:{
        type : String,
        required : true,
        enum : {
            values : ['noped','doped','accepted','rejected'],
            message : '{VALUE} status type is not valid'
        }
    }
},{timestamps:true})

connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequestModel = mongoose.model('ConnectionRequest',connectionRequestSchema);
module.exports = ConnectionRequestModel;

const mongoose = require('mongoose')

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://zameer:zameer2399@cluster0.y0t25ex.mongodb.net/DevSkip');
}

module.exports = connectDB;
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const User = require('./models/user')
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const requestRoute = require('./routes/request');
const userRoute = require('./routes/user')
const cors = require('cors')



const app = express();

app.use(cors({
    origin:'https://devskip.onrender.com',
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());



app.use('/',authRoute);
app.use('/profile',profileRoute);
app.use('/request',requestRoute);
app.use('/user',userRoute)



connectDB()
.then(async ()=>{
    console.log('DB connected successfully');
    await User.syncIndexes();
    app.listen(3000,()=>{
        console.log("server listening on PORT 3000")
    });
})
.catch((err)=>{
    console.log('Database connection failed mongoose error', err)
})




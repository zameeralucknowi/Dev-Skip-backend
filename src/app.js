const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const User = require('./models/user');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const requestRoute = require('./routes/request');
const userRoute = require('./routes/user');
const aiRoute = require('./routes/airoutes')
const path = require('path');
const cors = require('cors');
const initializeSocket = require('./utils/socket');

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin:'https://devskip.onrender.com',
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());


// API Routes
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/request', requestRoute);
app.use('/user', userRoute);
app.use('/ask',aiRoute)


const server = http.createServer(app);
initializeSocket(server);

// DB Connection and Server Start
connectDB()
  .then(async () => {
    console.log('DB connected successfully');
    await User.syncIndexes();
    server.listen(3000, () => {
      console.log('Server listening on PORT 3000');
    });
  })
  .catch((err) => {
    console.log('Database connection failed:', err);
  });

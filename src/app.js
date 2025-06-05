const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const User = require('./models/user');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const requestRoute = require('./routes/request');
const userRoute = require('./routes/user');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: 'https://devskip.onrender.com',
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve Vite build files (add this!)
const __dirnameResolved = path.resolve();
app.use(express.static(path.join(__dirnameResolved, 'dist')));

// API Routes
app.use('/auth', authRoute);
app.use('/profile', profileRoute);
app.use('/request', requestRoute);
app.use('/user', userRoute);

// Fallback: serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameResolved, 'dist', 'index.html'));
});

// DB Connection and Server Start
connectDB()
  .then(async () => {
    console.log('DB connected successfully');
    await User.syncIndexes();
    app.listen(3000, () => {
      console.log('Server listening on PORT 3000');
    });
  })
  .catch((err) => {
    console.log('Database connection failed:', err);
  });

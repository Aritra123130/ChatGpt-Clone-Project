const CookieParser = require('cookie-parser');
const express = require('express');
const authRoutes = require('./Routes/auth.routes')
const chatRoutes = require('./Routes/chats.routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(CookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));

app.use('/auth/api',authRoutes);
app.use('/auth/chat',chatRoutes);
module.exports = app;
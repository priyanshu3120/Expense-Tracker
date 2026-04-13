const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDb = require('./db/db');
const userRouter = require('./router/userRouter');
const expenseRouter = require('./router/expenseRouter');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Security Headers
app.use(helmet());

// CORS — only allow frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting on auth routes — prevent brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { status: 'error', statusCode: 429, message: 'Too many requests. Please try again later.' }
});

app.use(express.json());

// Routes
app.use('/auth', authLimiter, userRouter);
app.use('/expenses', authMiddleware, expenseRouter);

connectDb();

const port = process.env.PORT_NO || 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
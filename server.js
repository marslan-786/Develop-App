require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/chat-api', chatRouter);

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/alumni/jobs', require('./routes/jobRoutes'));
app.use('/api/jobs', require('./routes/verificationRoutes'));
app.use('/api/alumni/events', require('./routes/eventRoutes'));
app.use('/api/events', require('./routes/eventVerificationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

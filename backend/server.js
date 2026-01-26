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

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const jobRoutes = require('./routes/jobRoutes');
const verificationRoutes = require('./routes/verificationRoutes'); // Assuming this is job verification
const eventRoutes = require('./routes/eventRoutes');
const eventVerificationRoutes = require('./routes/eventVerificationRoutes');
const chatRoutes = require('./routes/chatRoutes'); // New chat routes import
const notificationRoutes = require('./routes/notificationRoutes'); // New notification routes

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/alumni/jobs', jobRoutes); // Original alumni job routes
app.use('/api/jobs', verificationRoutes); // Original job verification routes
app.use('/api/alumni/events', eventRoutes); // Original alumni event routes
app.use('/api/events', eventVerificationRoutes); // Original event verification routes
app.use('/api/chat', chatRoutes); // New chat routes mounting
app.use('/api/notifications', notificationRoutes); // Mount notification routes

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.io setup
const { Server } = require('socket.io');
const { socketAuthMiddleware, setupSocketHandlers } = require('./socket/socketHandler');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Socket.io authentication middleware
io.use(socketAuthMiddleware);

// Make io accessible to our router
app.set('io', io);

// Setup socket event handlers
setupSocketHandlers(io);

console.log('Socket.io server initialized');

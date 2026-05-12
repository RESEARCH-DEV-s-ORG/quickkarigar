const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import Custom Modules
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const chatSocket = require('./sockets/chatSocket');

// 1. Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);

// 2. Database Connection
connectDB();

// 3. Middleware
app.use(cors()); 
app.use(express.json()); 

// 4. API Routes
app.use('/api', apiRoutes);

// 5. Socket.io Initialization
const io = new Server(server, {
    cors: {
        origin: "*", // For development; specify your frontend URL in production
        methods: ["GET", "POST"]
    }
});

// Load Socket Events
chatSocket(io);

// 6. Base Route for Testing
app.get('/', (req, res) => {
    res.send('QuickKarigar Backend API is running...');
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server launched on http://localhost:${PORT}`);
});
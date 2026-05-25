const express = require('express');
const http = require('http');
const path = require("path");
const { Server } = require('socket.io');
const cors = require('cors');

require('dotenv').config();

// IMPORTS
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const chatSocket = require('./sockets/chatSocket');
const logger = require('./utils/logger');

// EXPRESS APP
const app = express();

const server = http.createServer(app);

// SOCKET SERVER
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// DATABASE
connectDB();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// REQUEST LOGGER
app.use((req, res, next) => {
    logger.info(
        `${req.method} ${req.originalUrl}`
    );
    next();
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use('/api', apiRoutes);
app.get("/", (req, res) => {
    res.render("index", {
        title: "My Landing Page"
    });
});


// SOCKET EVENTS
chatSocket(io);


// 404 HANDLER
app.use((req, res) => {
    logger.warn(
        `404 Route Not Found: ${req.originalUrl}`
    );
    res.status(404).json({
        success: false,
        message: 'Route Not Found'
    });
});
// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    logger.error(
        'Internal Server Error',
        err.message
    );
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});
// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    logger.success(
        `Server running on http://localhost:${PORT}`
    );
});
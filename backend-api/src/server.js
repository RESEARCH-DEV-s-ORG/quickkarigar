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
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://quickkargar.online",
    "https://web.quickkargar.online",
];
app.use(cors({
    origin: function (origin, callback) {

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS Not Allowed"));
        }
    },

    credentials: true,
}));
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
app.get("/partners", (req, res) => {
    res.render("pages/partners", {
        title: "Partner Program"
    });
});
app.get("/about-us", (req, res) => {
    res.render("pages/aboutus", {
        title: "Partner Program"
    });
});
app.get("/onboard", (req, res) => {
    res.render("pages/onboard", {
        title: "Partner Program"
    });
});
app.get("/download", (req, res) => {
    res.redirect("/");
});

app.get("/login", (req, res) => {
    res.redirect("https://web.quickkargar.online/");
});

// SOCKET EVENTS
chatSocket(io);

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

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
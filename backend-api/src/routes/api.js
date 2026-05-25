const express = require('express');

const router = express.Router();

const authRoutes =
    require('./authRoutes');

router.use(
    '/auth',
    authRoutes
);

// TEST ROUTE
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'QuickKarigar API Working'
    });
});

// HEALTH CHECK
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// SAMPLE USER ROUTE
router.get('/users', (req, res) => {

    res.status(200).json({
        success: true,
        users: []
    });
});

// SAMPLE WORKER ROUTE
router.get('/workers', (req, res) => {

    res.status(200).json({
        success: true,
        workers: []
    });
});

// SAMPLE BOOKING ROUTE
router.get('/bookings', (req, res) => {

    res.status(200).json({
        success: true,
        bookings: []
    });
});

module.exports = router;
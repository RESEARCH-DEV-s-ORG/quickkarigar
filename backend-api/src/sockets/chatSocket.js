const logger = require('../utils/logger');

module.exports = (io) => {
    io.on('connection', (socket) => {
        logger.socket(
            `New Connection: ${socket.id}`
        );
        // ═══════════════════════════════════════
        // JOIN ROOM
        // ═══════════════════════════════════════
        socket.on('join_room', (roomId) => {
            try {
                socket.join(roomId);

                logger.socket(
                    `Socket ${socket.id} joined room: ${roomId}`
                );
                socket.emit('room_joined', {
                    success: true,
                    roomId
                });
            } catch (error) {
                logger.error(
                    'Join Room Error',
                    error.message
                );
            }
        });
        // ═══════════════════════════════════════
        // SEND MESSAGE
        // ═══════════════════════════════════════
        socket.on('send_message', async (data) => {
            try {
                /*
                    data = {
                        roomId,
                        sender,
                        text,
                        timestamp
                    }
                */
                if (
                    !data.roomId ||
                    !data.sender ||
                    !data.text
                ) {
                    return socket.emit('message_error', {
                        success: false,
                        message: 'Invalid message data'
                    });
                }
                logger.info(
                    `Message from ${data.sender} in room ${data.roomId}`
                );
                // BROADCAST MESSAGE
                io.to(data.roomId).emit(
                    'receive_message',
                    {
                        success: true,
                        message: data
                    }
                );
            } catch (error) {
                logger.error(
                    'Send Message Error',
                    error.message
                );
                socket.emit('message_error', {
                    success: false,
                    message: 'Message sending failed'
                });
            }
        });
        // ═══════════════════════════════════════
        // NEW BOOKING REQUEST
        // ═══════════════════════════════════════
        socket.on('new_booking_request', (data) => {
            try {
                /*
                    data = {
                        workerId,
                        customerName,
                        serviceType
                    }
                */
                logger.info(
                    `New Booking Request for Worker ${data.workerId}`
                );
                io.to(data.workerId).emit(
                    'notify_worker',
                    {
                        success: true,
                        message:
                            `New ${data.serviceType} request from ${data.customerName}`,
                        bookingData: data
                    }
                );

            } catch (error) {
                logger.error(
                    'Booking Notification Error',
                    error.message
                );
            }
        });
        // ═══════════════════════════════════════
        // LIVE LOCATION UPDATE
        // ═══════════════════════════════════════
        socket.on('live_location', (data) => {

            try {
                /*
                    data = {
                        roomId,
                        latitude,
                        longitude,
                        userId
                    }
                */
                io.to(data.roomId).emit(
                    'location_updated',
                    data
                );
            } catch (error) {
                logger.error(
                    'Live Location Error',
                    error.message
                );
            }
        });

        // ═══════════════════════════════════════
        // TYPING INDICATOR
        // ═══════════════════════════════════════
        socket.on('typing', (data) => {
            socket.to(data.roomId).emit(
                'user_typing',
                {
                    userId: data.userId
                }
            );
        });
        // ═══════════════════════════════════════
        // DISCONNECT
        // ═══════════════════════════════════════
        socket.on('disconnect', () => {
            logger.warn(
                `User Disconnected: ${socket.id}`
            );
        });
        // ═══════════════════════════════════════
        // SOCKET ERROR
        // ═══════════════════════════════════════
        socket.on('error', (error) => {
            logger.error(
                `Socket Error: ${socket.id}`,
                error.message
            );
        });
    });
};
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        // 1. Join a specific room (e.g., based on Booking ID)
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        // 2. Handle Chat Messages
        socket.on('send_message', (data) => {
            // data: { roomId, sender, text, timestamp }
            io.to(data.roomId).emit('receive_message', data);
        });

        // 3. Notify Worker of a new Booking Request
        // In your API, when a booking is saved, you can emit this
        socket.on('new_booking_request', (data) => {
            // data: { workerId, customerName, serviceType }
            // Broadcast to the specific worker's personal room
            io.to(data.workerId).emit('notify_worker', {
                message: `New ${data.serviceType} request from ${data.customerName}`,
                bookingData: data
            });
        });

        // 4. Handle Disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
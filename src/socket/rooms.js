module.exports = (io) => {

    let onlineUsers = 0; 

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        onlineUsers += 1;

        io.emit('userQtd', onlineUsers);

        socket.on('joinRoom', (roomId, userData) => {
            socket.join(roomId);
            console.log(`${userData.username} joined room: ${roomId}`);

            socket.to(roomId).emit('user_entry', `${userData.username} has joined the room`);

            socket.emit('joinedRoom', roomId, `Welcome to room ${roomId}`);
        });

        socket.on('sendMessage', (roomId, data) => {
            io.to(roomId).emit('receiveMessage', data);
            console.log(`Message in room ${roomId}:`, data);
        });

        socket.on('disconnect', () => {
            onlineUsers -= 1;
            io.emit('userQtd', onlineUsers);
            console.log('User disconnected:', socket.id);
        });
    });
};

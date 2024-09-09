module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('user_data', (data) => {
            io.emit("user_entry", data);
        });

        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

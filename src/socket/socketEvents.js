module.exports = (io) => {

    let onlineUsers = 0; 

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        onlineUsers+=1;

        io.emit('userQtd', onlineUsers);

        socket.on('user_data', (data) => {
            io.emit("user_entry", data);
        });

        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data);
            console.log(data);
            
        });

        socket.on('disconnect', () => {
            onlineUsers-=1;
            io.emit('userQtd', onlineUsers);
            console.log('User disconnected:', socket.id);
        });
    });
};



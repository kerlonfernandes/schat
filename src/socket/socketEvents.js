const path = require('path');
const RoomModel = require('../models/roomModel'); 
const Intern = require('../utils/intern'); 
const roomModel = require('../models/roomModel');


module.exports = (io) => {
    let totalOnlineUsers = 0;
    let socketToRoomMap = {}; 

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        totalOnlineUsers += 1;
        io.emit('totalUserCount', totalOnlineUsers); 

        socket.on('joinRoom', (roomId, userData) => {
            socket.join(roomId);
            socketToRoomMap[socket.id] = roomId;
            socket.to(roomId).emit('user_entry', `${userData.name} has joined the room`);
            socket.emit('joinedRoom', roomId, true);
            
            updateOnlineUsersInRoom(roomId);
        });

        socket.on('heartbeat', () => {
            socket.emit('heartbeatResponse');
        });

        socket.on('sendMessage', (roomId, data) => {

            const roomModel = new RoomModel();

            io.to(roomId).emit('receiveMessage', data);
            
            if(data.user) {
                roomModel.createMessage(roomId, data.user, data.message, data.timestamp);    
            }
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            delete socketToRoomMap[socket.id];
            socket.to(roomId).emit('user_exit', 'A user has left the room');
            
            updateOnlineUsersInRoom(roomId);

            console.log(`User left room: ${roomId}`);
        });

        socket.on('disconnect', () => {
            totalOnlineUsers -= 1;
            io.emit('totalUserCount', totalOnlineUsers); //
            const roomId = socketToRoomMap[socket.id];
            if (roomId) {
                socket.leave(roomId);
                delete socketToRoomMap[socket.id];
                
                socket.to(roomId).emit('user_exit', 'A user has left the room');
                
                updateOnlineUsersInRoom(roomId);
            }
            console.log('User disconnected:', socket.id);
        });

        function updateOnlineUsersInRoom(roomId) {
            const clientsInRoom = io.sockets.adapter.rooms.get(roomId) || new Set();
            const onlineUsersInRoom = Array.from(clientsInRoom).map(socketId => {
                return io.sockets.sockets.get(socketId);
            }).filter(socket => socket).map(socket => {
                return {
                    id: socket.id,
                };
            });

            io.to(roomId).emit('updateOnlineUsers', {
                count: onlineUsersInRoom.length,
                users: onlineUsersInRoom
            });
        }
    });
};

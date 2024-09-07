const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const indexRouter = require('./routes/index'); // Atualize o caminho conforme a estrutura

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

// Use the router
app.use('/', indexRouter);

// Socket.IO events
require('./socket/socketEvents')(io);

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

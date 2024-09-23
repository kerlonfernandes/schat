const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const indexRouter = require('./routes/index'); 
const userRouter = require('./routes/user'); 
const roomsRouter = require('./routes/rooms'); 


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', roomsRouter);


require('./socket/socketEvents')(io);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

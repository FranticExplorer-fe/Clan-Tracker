const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Simple password protection for you and your friends
app.use(basicAuth({
    users: { 'your_username': 'your_secure_password' },
    challenge: true
}));

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Listen for typing from one user and broadcast to others
    socket.on('typing-data', (data) => {
        socket.broadcast.emit('update-typing', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));

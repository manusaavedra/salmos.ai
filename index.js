const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.common');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;



io.on('connection', (socket) => {
    
    console.log('New client connected (id: %s)', socket.id);
    
    socket.broadcast.emit('handshake', {
        body: 'handshake',
        id: socket.id,
        url: 'http://localhost:' + port + '/client'
    });

    socket.on('join', (data) => {
        socket.broadcast.emit('join', {
            from: socket.id,
            body: data.body
        });
    });

    socket.on('play', (data) => {
        socket.broadcast.emit('play', {
            from: socket.id,
            body: data.body
        });
    });

    socket.on('pause', (data) => {
        socket.broadcast.emit('pause', {
            from: socket.id,
            body: data.body
        });
    });

    socket.on('stop', (data) => {
        socket.broadcast.emit('stop', {
            from: socket.id,
            body: data.body
        });
    });

    socket.on('volume', (data) => {
        socket.broadcast.emit('volume', {
            from: socket.id,
            body: data.body
        });
    });

    socket.on('progress', (data) => {
        socket.broadcast.emit('progress', {
            from: socket.id,
            ...data
        });
    });

    socket.on('seeking', (data) => {
        socket.broadcast.emit('seeking', {
            from: socket.id,
            ...data
        });

        console.log('seeking', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use(webpackDevMiddleware(webpack(webpackConfig)));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

server.listen(port, () => {
    console.log('Server running on port: http://localhost:%s', port);
});

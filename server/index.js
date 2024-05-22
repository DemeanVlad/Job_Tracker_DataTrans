const app = require('./api');
const http = require('http');
const socketIo = require('socket.io');
const port = 8000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.emit('client-id', socket.id);

  socket.on('chat', (entry) => {
    io.emit('message-from-server', entry);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = require('socket.io')(8000, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests from any origin
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});
console.log('Server socket is listening on port 8000');

let connectedClients = new Map();

// Event fired every time a new client connects
io.on('connection', socket => {
  console.info(`Client connected [id=${socket.id}]`);
  connectedClients.set(socket.id, socket);
  console.log(connectedClients.size + ' client/s connected');

  // When socket disconnects, remove it from the map
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.info(`Client [id=${socket.id}] disconnected`);
    console.log(connectedClients.size + ' client/s connected');
  });

  socket.on('chat', payload => {
    sendMessageToAllOtherClients(socket, payload);
  });
});

function sendMessageToAllOtherClients(sender, message) {
  for (let [key, socket] of connectedClients) {
    if (key !== sender.id) { // Prevent sending the message back to the sender
      socket.emit('message-from-server', { 
        id: sender.id, 
        message: message.message, 
        messageId: message.messageId // Include the unique messageId
      });
    }
  }
}

module.exports = io;

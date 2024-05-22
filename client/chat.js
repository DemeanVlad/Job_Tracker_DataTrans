document.addEventListener('DOMContentLoaded', () => {
  var socket = io.connect('http://localhost:8000');

  let clientId = null;

  socket.on('client-id', function (id) {
    clientId = id;
    console.log('Received client ID:', clientId);
    const clientIdElement = document.getElementById('client-id');
    if (clientIdElement) {
      clientIdElement.innerHTML = 'Client id: ' + clientId;
    }
  });

  socket.on('message-from-server', function (entry) {
    console.log('Received message from server:', entry);
    addMessageToUI(entry);
  });

  const sendButton = document.getElementById('send');
  if (sendButton) {
    sendButton.removeEventListener('click', sendMessage); // Ensure previous listener is removed
    sendButton.addEventListener('click', sendMessage);
  }

  function sendMessage() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
      const message = messageElement.value.trim();
      if (message !== '') {
        const entry = {
          id: clientId,
          message: message,
          messageId: Date.now() // Unique identifier for each message
        };
        console.log('Sending message:', entry);
        socket.emit('chat', entry);
        messageElement.value = ''; // Clear the input
      }
    }
  }

  function addMessageToUI(entry) {
    const messagesContainer = document.getElementsByClassName('messages')[0];
    console.log('Adding message to UI:', entry);
    if (messagesContainer && !document.getElementById(entry.messageId)) {
      let p = document.createElement('p');
      p.id = entry.messageId; // Use the unique identifier for each message
      p.classList.add(entry.id === clientId ? 'user' : 'server');
      p.innerText = entry.id + ': ' + entry.message;
      messagesContainer.appendChild(p);
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
      console.log('Message added to UI:', entry);
    }
  }
});

// connectSocketIO.example.js
const io = require('socket.io-client');

function connect(url, opts = {}) {
  const socket = io(url, { autoConnect: true, reconnection: true, ...opts });

  socket.on('connect', () => {
    console.log('Socket connected', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error:', err.message);
  });

  socket.on('message', (data) => {
    console.log('message:', data);
  });

  return socket;
}

// Example usage:
if (require.main === module) {
  const url = process.env.SOCKET_URL || 'http://localhost:3000';
  const s = connect(url);
  // send test event after connect
  s.on('connect', () => s.emit('hello', { from: 'client-example' }));
}

module.exports = { connect };

// socketIO.js
const { connect } = require('./connectSocketIO.example');
const { handleListenerError } = require('./handlerWhenListenHasError');

function initSocket(url, opts = {}) {
  const socket = connect(url, opts);

  socket.on('error', (err) => {
    console.error('Socket error', err);
  });

  socket.on('reconnect_attempt', (count) => {
    console.log('Reconnect attempt', count);
  });

  // Example of adding a safe listener
  function safeOn(event, handler, retryOptions) {
    socket.on(event, async (payload) => {
      try {
        await handler(payload);
      } catch (err) {
        handleListenerError(err, { retryFn: () => handler(payload), ...retryOptions });
      }
    });
  }

  return { socket, safeOn };
}

module.exports = { initSocket };

// quick run
if (require.main === module) {
  const url = process.env.SOCKET_URL || 'http://localhost:3000';
  const s = initSocket(url);
  s.safeOn('ping', async (p) => { console.log('pinged', p); });
}

const { io } = require('socket.io-client');

const token = process.argv[2];
if (!token) {
  console.error('Usage: node test-socket.js <JWT>');
  process.exit(1);
}

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  auth: { token },
});

socket.on('connect', () => {
  console.log('connected', socket.id);
});

socket.on('notification:new', (payload) => {
  console.log('notification:new', JSON.stringify(payload, null, 2));
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err.message);
});

setTimeout(() => {
  console.log('exiting after 60s');
  socket.close();
  process.exit(0);
}, 60000);

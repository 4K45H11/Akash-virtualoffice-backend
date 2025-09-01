// middleware/socketAuth.js
const jwt = require('jsonwebtoken');

function socketAuth(socket, next) {
  try {
    // Expect token via socket.handshake.auth.token (recommended) or query fallback
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('no token'));

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // attach to socket for later use
    socket.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name || decoded.email.split('@')[0]
    };
    return next();
  } catch (e) {
    return next(new Error('invalid token'));
  }
}

module.exports = socketAuth;

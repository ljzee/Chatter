var { Server } = require("socket.io");
var io = null;

exports.io = function() {
  return io;
};

exports.initialize = function(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  return io;
};
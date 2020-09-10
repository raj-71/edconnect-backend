const { Chat } = require("../../models/chat");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (io) => {
  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        config.get("userPrivateKey"),
        function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  }).on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("message", async ({ room, userId, msg }) => {
      socket.to(room).emit("sendMsg", { msg, userId });
      let newMessage = new Chat({
        userId: userId,
        room: room,
        message: msg,
      });
      await newMessage.save();
      return;
    });
  });
};

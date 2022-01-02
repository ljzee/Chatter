class User {
  #id;
  #lastActivityTimestamp = Date.now();
  #sockets = [];

  constructor(id, socket) {
    this.#id = id;
    this.#sockets.push(socket);
  }

  getId() {
    return this.#id;
  }

  touchLastActivityTimestamp() {
    this.#lastActivityTimestamp = Date.now();
  }

  addSocket(socket) {
    this.touchLastActivityTimestamp();

    this.#sockets.push(socket);
  }

  removeSocket(socketId) {
    this.#sockets = this.#sockets.filter((socket) => {
      return socket.id !== socketId;
    });
  }

  isConnected() {
    return this.#sockets.length > 0;
  }

  sendEvent(eventType, event) {
    for(const socket of this.#sockets) {
      socket.emit(eventType, event);
    }
  }

  getStatus() {
    const idleAfterInactiveMs = 10000;
    const isActive = (Date.now() - this.#lastActivityTimestamp) < idleAfterInactiveMs;
    return isActive ? "active" : "idle";
  }

  toString() {
    const socketIds = this.#sockets.map((socket) => (socket.id));
    const socketIdsString = socketIds.join();

    return `{
      id: ${this.#id},
      lastActivityTimestamp: ${this.#lastActivityTimestamp},
      sockets: [${socketIdsString}]
    }`;
  }
}

module.exports = User;

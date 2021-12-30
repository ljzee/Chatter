class UserManager {
  #userMap = new Map();

  getUser(id) {
      return this.#userMap.get(id);
  }

  addUser(user) {
    this.#userMap.set(user.getId(), user);
  }

  removeUser(id) {
    this.#userMap.delete(id);
  }

  hasUser(id) {
    return this.#userMap.has(id);
  }

  toString() {
    var string = "{\n";

    this.#userMap.forEach((value, key) => {
      string += `    ${key}:  ${value.toString()},\n`;
    });

    string += "}\n";

    return string;
  }

}

module.exports = new UserManager();

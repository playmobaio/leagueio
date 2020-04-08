var constants = require('./constants.js');

class Player {
  constructor(id) {
    this.id = id;
    this.x = Math.floor(Math.random() * constants.MAPSIZE);
    this.y = Math.floor(Math.random() * constants.MAPSIZE);
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

module.exports = Player;
'use strict';

const uuid = require('uuid');

module.exports = class Player {

  constructor(name = '', ip = '123.0.0.1', port = "4001") {
    this.id = uuid.v4();
    this.name = name;
    this.ip = ip;
    this.port = port;
    this.wins = 0;
    this.losses = 0;
  }
};

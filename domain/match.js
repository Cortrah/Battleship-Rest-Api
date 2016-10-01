'use strict';

const uuid = require('uuid');

module.exports = class Match {

  constructor() {
    this.id = uuid.v4();

  }
}

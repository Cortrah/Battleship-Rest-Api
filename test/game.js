'use strict';

const Assert = require('assert');
const Lab = require('lab');

const Card = require('../game');

const lab = exports.lab = Lab.script();

lab.test('creates a new game with a random grid containing a valid fleet', (done) => {

  const input = 'AH';

  const game = new Game();
  Assert( game.getGrid().length === 100);
  done();
});

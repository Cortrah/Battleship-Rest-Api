'use strict';

const Assert = require('assert');
const Lab = require('lab');

const Game = require('../game');

const lab = exports.lab = Lab.script();

lab.experiment('creates a new game with a random grid containing a valid fleet', () => {

  const game = new Game();
  const grid = game.getGrid();

  lab.test('has a grid of 100 characters', (done) => {
    Assert( grid.length === 100);
    done();
  });

  lab.test('contains a carrier, with five 1\'s', (done) => {
    Assert( grid.match(/1/g).length === 5);
    done();
  });

  lab.test('contains a battleship, with four 2\'s', (done) => {
    Assert( grid.match(/2/g).length === 4);
    done();
  });

  lab.test('contains a cruiser, with three 3\'s', (done) => {
    Assert( grid.match(/3/g).length === 3);
    done();
  });

  lab.test('contains a submarine, with three 4\'s', (done) => {
    Assert( grid.match(/4/g).length === 3);
    done();
  });

  lab.test('contains a destroyer, with two 5\'s', (done) => {
    Assert( grid.match(/5/g).length === 2);
    done();
  });

});

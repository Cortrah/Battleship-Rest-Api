'use strict';

const Assert = require('assert');
const Lab = require('lab');

const Targeter = require('../targeter');

const lab = exports.lab = Lab.script();

lab.experiment('creates a new game with a random grid containing a valid fleet', () => {

  const targeter = new Targeter();
  const grid = targeter.getGrid();

  lab.test('- they are different each time', (done) => {
    const otherTargeter = new Targeter();
    Assert( grid != otherTargeter.getGrid());
    done();
  });

  lab.test('- a grid has 100 characters', (done) => {
    Assert( grid.length === 100);
    done();
  });

  lab.test('- all between 0 and 5', (done) => {
    Assert( grid.match(/[^0-5]/g) === null);
    done();
  });

  lab.test('- it contains a carrier (has five 1\'s)', (done) => {
    Assert( grid.match(/1/g).length === 5);
    done();
  });

  lab.test('- it contains a battleship (has four 2\'s)', (done) => {
    Assert( grid.match(/2/g).length === 4);
    done();
  });

  lab.test('- it contains a cruiser (has three 3\'s)', (done) => {
    Assert( grid.match(/3/g).length === 3);
    done();
  });

  lab.test('- it contains a submarine (has three 4\'s)', (done) => {
    Assert( grid.match(/4/g).length === 3);
    done();
  });

  lab.test('- it contains a destroyer (has two 5\'s)', (done) => {
    Assert( grid.match(/5/g).length === 2);
    done();
  });

});

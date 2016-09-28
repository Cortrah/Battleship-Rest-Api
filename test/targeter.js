'use strict';

const Assert = require('assert');
const Lab = require('lab');

const Targeter = require('../targeter');

const lab = exports.lab = Lab.script();

lab.experiment('creates a new game with a random grid containing a valid fleet', () => {

  const targeter = new Targeter();
  const grid = targeter.getGrid();
  console.log(targeter.getFormattedGrid());

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

  // Todo: - check that the #'s are contiguous

});

lab.experiment('receives and reports shots', () => {

  const targeter = new Targeter();
  const grid = targeter.getGrid();

  lab.test('- receives and returns a miss', (done) => {

    let firstBlankIndex = grid.indexOf('0');
    // Todo: extract targeter.rows to shared space
    const firstBlankRow = targeter.rows[Math.floor(firstBlankIndex / 10)];
    const firstBlankCol = firstBlankIndex % 10 + 1;

    Assert(targeter.receiveShot(firstBlankRow, firstBlankCol) === 0);
    done();
  });

  lab.test('- receives and returns a hit', (done) => {

    // Todo: extract fleet codes to shared space
    const firstSubIndex = grid.indexOf('4');
    const firstSubRow = targeter.rows[Math.floor(firstSubIndex / 10)];
    const firstSubCol = firstSubIndex % 10 + 1;

    Assert(targeter.receiveShot(firstSubRow, firstSubCol) === 1);
    done();

  });

  lab.test('- records a series of shots and notifies of a sunken ship', (done) => {
    const firstDestroyerIndex = grid.indexOf('5');
    const firstDestroyerRow = targeter.rows[Math.floor(firstDestroyerIndex / 10)];
    const firstDestroyerCol = firstDestroyerIndex % 10 + 1;
    let secondDestroyerRow = '';

    Assert(targeter.receiveShot(firstDestroyerRow, firstDestroyerCol) === 1);

    if (grid[firstDestroyerIndex + 1] === '5') {
      // then the destroyer is horizontal
      Assert(targeter.receiveShot(firstDestroyerRow, firstDestroyerCol + 1) === 2);
    } else {
      // the destroyer is vertical
      secondDestroyerRow = targeter.rows[Math.floor(firstDestroyerIndex / 10) + 1];
      Assert(targeter.receiveShot(secondDestroyerRow, firstDestroyerCol) === 2);
    }

    // after the second shot the first shot should also return sunk
    Assert(targeter.receiveShot(firstDestroyerRow, firstDestroyerCol) === 2);
    done();
  });
});

lab.experiment('targets and records shots', () => {

  const targeter = new Targeter();
  const grid = targeter.getGrid();

  lab.test('- returns a shot in the form of {row:"A", col:"2"}', (done) => {

    const shot = targeter.targetMyShot();
    Assert(targeter.rows.includes(shot.row));
    Assert( (0 < shot.col) && (shot.col  <= 10));

    // notify of a hit
    targeter.recordMyShotResult(1);

    // and check that it was recorded
    Assert(targeter.enemyMap.get(shot.row+shot.col) === 1);

    done();
  });
});

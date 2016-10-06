'use strict';

const Assert = require('assert');
const Lab = require('lab');

const Player = require('../domain/player');

const lab = exports.lab = Lab.script();

lab.experiment('creates a player', () => {

  lab.test('- with defaults', (done) => {
    let testPlayer = new Player('Rowlf')

    Assert(testPlayer.name === 'Rowlf');
    Assert(testPlayer.ip === 'http://pumpkin.local');
    Assert(testPlayer.port === '4000');
    Assert(testPlayer.wins === 0);
    Assert(testPlayer.losses === 0);
    done();
  });
});

'use strict';

const Assert = require('assert');
const Lab = require('lab');
const Player = require('../domain/player');
const Match = require('../domain/match');

const lab = exports.lab = Lab.script();

lab.experiment('creates a new match', () => {

  let player1 = new Player("Guy");
  let player2 = new Player("Smiley");
  let testMatch = new Match(player1, player2);

  lab.test('- it has two players', (done) => {

    Assert(testMatch.players.length ===2);
    done();
  });

  lab.test('- after running the play function there is a winner', (done) => {

    testMatch.play();
    Assert(testMatch.winner !== null);
    done();
  });

  lab.test('- and it increments wins and losses', (done) => {

    if(player1.id === testMatch.winner.id){
      Assert(player1.wins === 1);
      Assert(player2.losses === 1);
    } else {
      Assert(player2.wins === 1);
      Assert(player1.losses === 1);
    }
    done();
  });


});

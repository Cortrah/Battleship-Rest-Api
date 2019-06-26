'use strict';

const Assert = require('assert');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

let server = require('../server.js');

lab.experiment('creates a new match with two players', () => {

  let player1;
  let player2;
  let match;
  let matches;
  let players;

  lab.test('- it creates a player with a name, ip and port and returns one with no wins or losses', (done) => {

    const person = {
      name: 'Mr Monster',
      ip: 'http://localhost',
      port: '4000'
    };

    const options = {
      method: 'POST',
      url: '/battleship/player',
      payload: person
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      player1 = JSON.parse(res.payload);
      Assert(player1.name === person.name);
      Assert(player1.ip === person.ip);
      Assert(player1.port === person.port);
      Assert(player1.wins === 0);
      Assert(player1.losses === 0);
      done();
    })
  });

  lab.test('- it creates another player', (done) => {

    const person = {
      name: 'Hapi Pumpkin',
      ip: 'http://localhost',
      port: '4000'
    };

    const options = {
      method: 'POST',
      url: '/battleship/player',
      payload: person
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      player2 = JSON.parse(res.payload);
      Assert(player2.name === person.name);
      Assert(player2.ip === person.ip);
      Assert(player2.port === person.port);
      Assert(player2.wins === 0);
      Assert(player2.losses === 0);
      done();
    })
  });

  lab.test('- it creates a match and returns the results, with a win and a loss', (done) => {

    const players = {
      player1Id: player1.id,
      player2Id: player2.id
    };

    const options = {
      method: 'POST',
      url: '/battleship/match',
      payload: players
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      match = JSON.parse(res.payload);
      Assert(match.matchResults.actions.length > 0);
      Assert(match.matchResults.winner !== null);
      Assert(match.matchResults.players.length === 2);
      Assert(match.matchResults.players[0].wins + match.matchResults.players[1].wins === 1);
      Assert(match.matchResults.players[0].losses + match.matchResults.players[1].losses === 1);
      done();
    })
  });

  lab.test('- it lists the players, one has a win, the other a loss', (done) => {

    const options = {
      method: 'GET',
      url: '/battleship/players'
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      players = JSON.parse(res.payload).players;
      Assert(players[0].wins + players[1].wins === 1);
      Assert(players[0].losses + players[1].losses === 1);
      done();
    })
  });

  lab.test('- it lists the matches', (done) => {

    const options = {
      method: 'GET',
      url: '/battleship/matches'
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      matches = JSON.parse(res.payload).matches;
      Assert(matches.length === 1);
      done();
    })
  });

  lab.test('- it deletes a player', (done) => {

    let playerId = players[0].id;
    const options = {
      method: 'DELETE',
      url: '/battleship/player/' + playerId
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === 'player deleted');
      done();
    })
  });

  lab.test('- it lists the players, one less than before', (done) => {

    const options = {
      method: 'GET',
      url: '/battleship/players'
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      players = JSON.parse(res.payload).players;
      Assert(players.length === 1);
      done();
    })
  });


  lab.test('- after deleting, it reports a player not found', (done) => {

    let playerId = players[0].id;
    const options = {
      method: 'DELETE',
      url: '/battleship/player/' + playerId
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === 'player deleted');
      done();
    })
  });

  lab.test('- it deletes a match', (done) => {

    let matchId = matches[0].id;
    const options = {
      method: 'DELETE',
      url: '/battleship/match/' + matchId
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === 'match deleted');
      done();
    })
  });

  lab.test('- after deleting, it reports a match not found', (done) => {

    let matchId = matches[0].id;
    const options = {
      method: 'DELETE',
      url: '/battleship/match/' + matchId
    };

    server.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === 'match not found');
      done();
    })
  });
});

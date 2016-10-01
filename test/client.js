'use strict';

const Assert = require('assert');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

let client = require('../client.js');

lab.experiment('test a game', () => {

  let testGameId = '';

  lab.test('- it creates a game client with a grid of 100 characters', (done) => {

    const options = {
      method: 'POST',
      url: '/battleship/game'
    };

    client.inject( options, (res) => {

      Assert(res.statusCode === 200);
      let response = JSON.parse(res.payload);

      testGameId = response.gameId;

      Assert(response.grid.length === 100);
      done();
    })
  });

  lab.test('- it creates a valid shot', (done) => {

    const options = {
      method: 'POST',
      url: '/battleship/game/' + testGameId + '/shot'
    };

    client.inject( options, (res) => {

      Assert(res.statusCode === 200);
      const response = JSON.parse(res.payload);
      Assert(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].indexOf(response.letter) !== -1);
      Assert(response.number > 0);
      Assert(response.number <= 10);
      done();
    })
  });

  lab.test('- it receives a shot result', (done) => {

    const options = {
      method: 'POST',
      url: '/battleship/game/' + testGameId + '/shot-result/1'
    };

    client.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === "shot result accepted");
      done();
    })
  });

  lab.test('- it receives a shot and returns 0 miss, 1 hit or 2 sink', (done) => {

    const options = {
      method: 'POST',
      url: '/battleship/game/' + testGameId + '/receive-shot/A/1'
    };

    client.inject( options, (res) => {

      Assert(res.statusCode === 200);
      const response = JSON.parse(res.payload);
      Assert(response.result >= 0);
      Assert(response.result <= 2);
      done();
    })
  });

  lab.test('- it deletes the test game', (done) => {

    const options = {
      method: 'DELETE',
      url: '/battleship/game/' + testGameId
    };

    client.inject( options, (res) => {

      Assert(res.statusCode === 200);
      Assert(res.payload === "game deleted");
      done();
    })
  });

});


'use strict';

const Assert = require('assert');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

let restClient;

//lab.before((done) => {
//
//  require('../client')((err, client) =>{
//    restClient = client;
//    done();
//  });
//});

//lab.experiment('test a game', () => {
//
//  let testGameId = '';
//
//  lab.test('- it creates a game client with a grid of 100 characters', (done) => {
//
//    const options = {
//      method: 'POST',
//      url: '/battleship/game'
//    };
//
//    restClient.inject( options, (res) => {
//
//      Assert(res.statusCode === 200);
//      let response = JSON.parse(res.payload);
//
//      Assert(response.grid.length === 100);
//      done();
//    })
//  });

  //lab.test('- it creates a shot', (done) => {
  //
  //  const options = {
  //    method: 'POST',
  //    url: '/battleship/game/afc59c54-fc18-4b27-8894-8b59799d174a/shot'
  //  }
  //
  //  restClient.inject( options, (res) => {
  //
  //    Assert(res.statusCode === 200);
  //    const response = JSON.parse(res.payload);
  //    done();
  //  })
  //});
//});


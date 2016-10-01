'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Targeter = require('./targeter');

const server = new Hapi.Server();
server.connection({port: 4000});

let Targeters = new Map();

server.route([
  {
    method: 'POST',
    path: '/battleship/game',
    config: {
      description: 'Creates a game and returns a gameId and a grid with ships on it to the referee',
      tags: ['api'],
      notes: ['use a guid for the gameId', 'validate the game board'],
      response: {
        schema: {
          gameId: Joi.string().guid().required(),
          grid: Joi.string().length(100)
        }
      }
    },
    handler: function (request, reply) {

      let newTargeter = new Targeter();
      Targeters.set(newTargeter.id, newTargeter);

      reply({
        gameId: newTargeter.id,
        grid: newTargeter.getGrid()
      });
    }
  }, {
    method: 'POST',
    path: '/battleship/game/{gameId}/shot',
    config: {
      description: 'Takes a gameId and returns a shot in the form A2 (where A=Row, 2=Col)',
      notes: ['Validate that it receives an active gameId and that the row and col are between A-J 1-10'],
      validate: {
        params: {
          gameId: Joi.string().guid().required()
        }
      },
      response: {
        schema: {
          letter: Joi.string().valid('A','B','C','D','E','F','G','H','I','J').required(),
          number: Joi.number().integer().min(1).max(10).required()
        }
      }
    },
    handler: function (request, reply) {
      let shot = Targeters.get(request.params.gameId).targetMyShot();
      reply({
        letter: shot.row,
        number: shot.col
      });
    }
  }, {
    method: 'POST',
    path: '/battleship/game/{gameId}/shot-result/{shotresult}',
    config: {
      description: 'Takes a gameId and the results of our last shot, 0 miss, 1 hit, 2 sunk',
      notes: ['Validate that it receives an active gameId and that the result is 0, 1 or 2'],
      validate: {
        params: {
          gameId: Joi.string().guid().required(),
          shotresult: Joi.number().integer().min(0).max(2).required()
        }
      }
    },
    handler: function (request, reply) {
      Targeters.get(request.params.gameId).recordMyShotResult(request.params.shotresult);
      reply(
          'shot result accepted'
      );
    }
  }, {
    method: 'POST',
    path: '/battleship/game/{gameId}/receive-shot/{letter}/{number}',
    config: {
      description: 'Receive a shot with a gameId composed of a letter and number.' +
      'Return 0 for a miss, 1 for a hit and 2 for sunk',
      notes: ['Validate that it receives an active gameId, a leter from A-J and a number from 1-10'],
      validate: {
        params: {
          gameId: Joi.string().guid().required(),
          letter: Joi.string().valid('A','B','C','D','E','F','G','H','I','J').required(),
          number: Joi.number().integer().min(1).max(10).required()
        }
      }
    },
    handler: function (request, reply) {
      reply({
        // 0 miss, 1 hit, 2 sunk
        result: Targeters.get(request.params.gameId).receiveShot(request.params.letter, request.params.number)
      });
    }
  }, {
    method: 'DELETE',
    path: '/battleship/game/{gameId}',
    config: {
      description: 'Receives a gameId to delete and make inactive',
      notes: ['Validate that the gameId was valid and the game was active'],
      validate: {
        params: {
          gameId: Joi.string().guid().required()
        }
      }
    },
    handler: function (request, reply) {

      if(Targeters.has(gameId)){
        Targeters.clear(request.params.gameId);
        reply('game deleted');
      } else {
        reply('game not found');
      }
    }
  }, {
    method: 'GET',
    path: '/{params*}',
    config: {
      description: 'Default route for any get handlers, point the user to docs for reference information',
    },
    handler: function (request, reply) {
      reply(
          'Battleship Game Client ' + server.info.uri + '/docs for details'
      );
    }
  }
]);

server.register([
  require('vision'),
  require('inert'),
  require('lout'),
  {
    register: require('good'),
    options: {
      reporters: {
        reporter: [{module: 'good-console'}, 'stdout']
      }
    }
  }], (err) => {

  if (err) {
    return console.error(err);
  }

  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Battleship client running at:', server.info.uri);
  });
});

module.exports = server;

const Hapi = require('hapi');
const Joi = require('joi');
const Client = require('./client');
const Player = require('./player');

const server = new Hapi.Server();
server.connection({port: 5000});

let clients = new Map();
let players = new Map();

server.route([
  {
    method: 'POST',
    path: '/battleship/player',
    config: {
      description: 'Takes a name, ip and port and returns a registered player with playerId',
      notes: ['Validate that it receives valid inputs and returns a guid, generate a name if not given'],
      validate: {
        payload: {
          name: Joi.string(),
          ip: Joi.string().required(),
          port: Joi.string().required()
        }
      },
      response: {
        schema: {
          playerId: Joi.string().guid().required(),
          name: Joi.string().required(),
          ip: Joi.string().required(),
          port: Joi.string().required(),
          wins: Joi.number().integer().required(),
          losses: Joi.number().integer().required(),
        }
      }
    },
    handler: function (request, reply) {
      let newPlayer = new Player(request.payload);
      players.set(newPlayer.id, newPlayer);

      reply({
        playerId: newPlayer.id,
        name: newPlayer.name,
        ip: newPlayer.ip,
        port: newPlayer.port,
        wins: newPlayer.wins,
        losses: newPlayer.losses
      });
    }
  }, {
    method: 'DELETE',
    path: '/battleship/player/{playerId}',
    config: {
      description: 'Delete a player defined by a playerId',
      validate: {
        params: {
          playerId: Joi.string().guid().required()
        }
      },
    },
    handler: function (request, reply) {
      if(players.has(playerId)){
        players.clear(request.params.playerId);
        reply('player deleted');
      } else {
        reply('player not found');
      }
    }
  },{
    method: 'POST',
    path: '/battleship/game',
    config: {
      description: 'Takes two registered players ids and spawns a game for them',
      notes: ['use a guid for the player and game ids, monitor play with local game board to determine victor'],
      response: {
        schema: {
          gameId: Joi.string().guid().required(),
          actions: Joi.object().required()
        }
      }
    },
    handler: function (request, reply) {
      let newClient = new Client();
      clients.set(newClient.id, newClient);
      reply({
        gameId: newClient.id,
        actions: {}
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
      if(clients.has(gameId)){
        clients.clear(request.params.gameId);
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
          'Battleship Game Server ' + server.info.uri + ':5000/docs for details'
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

    console.log('Battleship Server running at:', server.info.uri);
  });
});

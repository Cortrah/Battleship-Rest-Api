const Hapi = require('hapi');
const Joi = require('joi');
const Client = require('./client');
const Player = require('./domain/player');
const Match = require('./domain/match');

const server = new Hapi.Server();
server.connection({port: 5000});

let players = new Map();
let matches = new Map();

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
          losses: Joi.number().integer().required()
        }
      }
    },
    handler: function (request, reply) {
      let newPlayer = new Player(request.payload.name, request.payload.ip, request.payload.port);
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
    method: 'GET',
    path: '/battleship/players',
    config: {
      description: 'Return a list of players'
    },
    handler: function (request, reply) {

      reply({
        players: players,
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
      if(players.has(request.params.playerId)){
        players.clear(request.params.playerId);
        reply('player deleted');
      } else {
        reply('player not found');
      }
    }
  },{
    method: 'POST',
    path: '/battleship/match',
    config: {
      description: 'Takes two registered players ids and spawns a match for them, returning the results',
      notes: ['uses guids for the players and match ids, monitor play with local game board to determine victor'],
      response: {
        schema: {
          matchResults: Joi.object(),
          message: Joi.string()
        }
      }
    },
    handler: function (request, reply) {
      // extract players from payload playerId's
      // and create a match
      let player1 = new Player("Inspector Gadget");
      let player2 = new Player("Hong Kong Phoey");
      let newMatch = new Match(player1, player2);

      players.set(player1.id, player1);
      players.set(player2.id, player2);
      matches.set(newMatch.id, newMatch);
      // then play the match until there is a winner
      newMatch.play();

      // then reply with the matchResults
      reply({
        matchResults: newMatch,
        message: newMatch.winner.name + ' won'
      });
    }
  }, {
    method: 'GET',
    path: '/battleship/matches',
    config: {
      description: 'Return a list of matches'
    },
    handler: function (request, reply) {

      reply({
        matches: matches,
      });
    }
  }, {
    method: 'DELETE',
    path: '/battleship/match/{matchId}',
    config: {
      description: 'Receives a matchId to delete and make inactive',
      notes: ['Validate that the matchId was valid and the game was active'],
      validate: {
        params: {
          matchId: Joi.string().guid().required()
        }
      }
    },
    handler: function (request, reply) {
      if(matches.has(request.params.matchId)){
        matches.clear(request.params.matchId);
        reply('match deleted');
      } else {
        reply('match not found');
      }
    }
  }, {
    method: 'GET',
    path: '/{params*}',
    config: {
      description: 'Default route for any get handlers, point the user to docs for reference information',
    },
    handler: function (request, reply) {
      reply('players', this.players);
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

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    isCached: false
  });

  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Battleship Server running at:', server.info.uri);
  });
});

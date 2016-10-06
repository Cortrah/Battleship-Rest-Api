'use strict';

const uuid = require('uuid');

module.exports = class Match {

  constructor(player1, player2, useRemoteCalls = false) {
    this.id = uuid.v4();
    this.name = player1.name + ' vs ' + player2.name;
    // order in the array determines who goes first
    this.players = [];
    this.actions = [];
    this.winner = null;
    this.useRemoteCalls = useRemoteCalls;

    // randomize who gets to go first
    if(this.coinFlip() === true){
      this.players.push(player1);
      this.players.push(player2);
    } else {
      this.players.push(player2);
      this.players.push(player1);
    }
  }

  play () {
    while(this.winner === null) {
      // if the other players ships are not sunk
      if (this.players[1].targeter.shipsRemaining() > 0) {
        // ask for a shot from the first player
        let shot = this.targetMyShot(0);

        // get a result from the second player
        // first via http ala wreck
        // but also check it for accuracy myself
        let shotResult = this.receiveShot(1, shot);

        // return a result to the first player
        this.recordMyShotResult(0, shotResult);

        this.actions.push({
          "action": 'shot',
          "playerId": this.players[0].id,
          "target": shot,
          "result": shotResult
        });

        let shipsLeft = this.players[1].targeter.shipsRemaining();
        // check for victory again
        if (shipsLeft === 0) {
          // notify of victory
          this.winner = this.players[0];
          this.players[0].wins++;
          this.players[1].losses++;
        }
      }
      if( this.winner === null) {
        if (this.players[0].targeter.shipsRemaining() > 0) {
          // ask for a shot from the first player
          let shot = this.targetMyShot(1);

          // get a result from the second player
          // first via http ala wreck
          // but also check it for accuracy myself
          let shotResult = this.receiveShot(0, shot);

          // return a result to the first player
          this.recordMyShotResult(1, shotResult);

          this.actions.push({
            "action": 'shot',
            "playerId": this.players[1].id,
            "target": shot,
            "result": shotResult
          });

          let shipsLeft = this.players[0].targeter.shipsRemaining();
          // check for victory again
          if (shipsLeft === 0) {
            // notify of victory
            this.winner = this.players[1];
            this.players[1].wins++;
            this.players[0].losses++;
          }
        }
      }
    }
  }

  coinFlip() {
    return Math.round(Math.random()) === 1;
  }

  targetMyShot (playerIndex) {
    if(this.useRemoteCalls === true){
      //
    } else {
      return this.players[playerIndex].targeter.targetMyShot();
    }
  }

  receiveShot (playerIndex, shot) {
    if(this.useRemoteCalls === true){
      //
    } else {
      return this.players[playerIndex].targeter.receiveShot(shot.row, shot.col);
    }
  }

  recordMyShotResult (playerIndex, shotResult) {
    if(this.useRemoteCalls === true){
      //
    } else {
      this.players[playerIndex].targeter.recordMyShotResult(shotResult);
    }
  }
};

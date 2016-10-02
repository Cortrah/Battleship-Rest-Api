'use strict';

const uuid = require('uuid');

module.exports = class Match {

  constructor(player1, player2) {
    this.id = uuid.v4();
    this.name = '';
    // order in the array determines who goes first
    this.players = [];
    this.actions = [];
    this.winner = null;

    if(this.coinFlip()){
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
        let shot = this.players[0].targeter.targetMyShot();

        // get a result from the second player
        // first via http ala wreck
        // but also check it for accuracy myself
        let shotResult = this.players[1].targeter.receiveShot(shot.row, shot.col);

        // return a result to the first player
        this.players[0].targeter.recordMyShotResult(shotResult);

        // check for victory again
        if (this.players[1].targeter.shipsRemaining() === 0) {
          // notify of victory
          this.winner = this.players[0];
          this.players[0].wins++;
          this.players[1].losses++;
        }
      }
      if( this.winner === null) {
        if (this.players[0].targeter.shipsRemaining() > 0) {
          // ask for a shot from the first player
          let shot = this.players[1].targeter.targetMyShot();

          // get a result from the second player
          // first via http ala wreck
          // but also check it for accuracy myself
          let shotResult = this.players[0].targeter.receiveShot(shot.row, shot.col);

          // return a result to the first player
          this.players[1].targeter.recordMyShotResult(shotResult);

          // check for victory again
          if (this.players[0].targeter.shipsRemaining() === 0) {
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
};

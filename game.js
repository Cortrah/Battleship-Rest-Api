 'use strict';

const uuid = require('uuid');

module.exports = class Game {

  constructor() {
    this.id = uuid.v4();
    this.lastRow = '';
    this.lastCol = '0';
    this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    this.fleet = [
      {"type": 'carrier',     "code": 1, "size": 5, facing:"HORIZONTAL", location: {row:'A', col:1}},
      {"type": 'battleship',  "code": 2, "size": 4, facing:"HORIZONTAL", location: {row:'B', col:1}},
      {"type": 'cruiser',     "code": 3, "size": 3, facing:"HORIZONTAL", location: {row:'C', col:1}},
      {"type": 'submarine',   "code": 4, "size": 3, facing:"HORIZONTAL", location: {row:'D', col:1}},
      {"type": 'destroyer',   "code": 5, "size": 2, facing:"HORIZONTAL", location: {row:'E', col:1}},
    ];

    // My Map
    // the key is a Row + Col string
    // code of '0' is for an empty location
    // code of '1' is for a ship type of '1'
    // ex: this.myMap.set('A1', {code: '1', isHit: false});
    this.myMap = new Map();

    // Enemy Map
    // '-' is an untested location
    // '0' is for a miss
    // '1' is for a hit
    // '2' is for a sunken ship location
    this.enemyMap = new Map();

    this.initMaps();
    this.placeFleet();

    this.actions = [];
  }

  initMaps() {
    for (let col = 1; col <= 10; ++col) {
      for (let rowIndex = 0; rowIndex < 10; ++rowIndex) {
        let rowVal = this.rows[rowIndex];
        let key = rowVal+col;
        this.enemyMap.set(key, '-');
        this.myMap.set(key, {code: '0', isHit: false});
      };
    };
  }

  placeFleet() {

    // for each ship (of size x)
    for (let s = 0; s < this.fleet.length; ++s){
      let ship = this.fleet[s];

      // randomize whether we place each ship vertically or horizontally
      let facing = this.coinFlip() ? 'VERTICAL' : 'HORIZONTAL';

      // find a starting location for that ship with that facing
      // which fits the board and doesn't clash with another ship

      let loc = {};
      let found = false;
      while(found === false) {
        // choose a coordinate
        loc = this.getRandomLocation();

        // and test it
        found = this.testCoordinate(ship, loc, facing);
      }
      // once found, place the ship
      // init the offsets to 0
      let rowOffset = 0;
      let colOffset = 0;
      for( let i = 0; i < ship.size; ++i){
        (facing === 'HORIZONTAL') ? colOffset = i : rowOffset = i;
        let key = this.offsetRow(loc.row, rowOffset) + (loc.col + colOffset).toString();
        this.myMap.set(key, {code: ship.code, isHit: false});
      }
    };
  }

  offsetRow(rowChar, offsetVal) {
    if(offsetVal != 0) {
      let index = this.rows.indexOf(rowChar) + offsetVal;
      return this.rows[index];
    } else {
      return rowChar;
    }
  }

  testCoordinate(ship, location, facing) {
    // using ship.size and facing
    // check if it fits the board (check for v or h)
    if (facing === 'HORIZONTAL'){
      if ( location.col + ship.size > 10){
        return false;
      }
    } else {
      if ( this.rows.indexOf(location.row) + ship.size > 9){
        return false;
      }
    }
    // & doesn't overlap another ship (check for v or h)
    // for now just return true
    return true;
  }

  // return a random boolean value
  coinFlip() {
    return Math.round(Math.random()) === 1;
  }

  // get a random location
  getRandomLocation() {
    let row = this.rows[Math.floor(Math.random(10) * 10)];
    let col = Math.ceil(Math.random(10) * 10);
    return ({row: row, col: col});
  }

  targetMyShot() {
    // to start just get a random location
    let loc = this.getRandomLocation();
    this.lastRow = loc.row;
    this.lastCol = loc.col;
    return ({row: loc.row, col: loc.col});;
  }

  recordMyShotResult(shotResults) {
    this.enemyMap.set( this.lastRow + this.lastCol, shotResults);
  }

  checkIsSunk(target) {
    let code = target.code;
    let remaining = 0;
    // see how many locations with this code are not hit,
    this.myMap.forEach( function( value) {
      if (( code === value.code) && (value.isHit === false)){
        remaining++;
      };
    });

    if(remaining === 0){
      return true;
    } else {
      return false;
    }
  }

  receiveShot(row, col) {
    let target = this.myMap.get(row + col);

    if(target.code === '0'){
      // missed
      return 0;
    } else {
      target.isHit = true;
      if (this.checkIsSunk(target) === true) {
        return 2;
      } else {
        return 1;
      }
    }
  }

  getGrid() {
    let gridVal = '';
    for ( let rowIndex = 0; rowIndex < 10; ++rowIndex) {
      let rowVal = this.rows[rowIndex];
      for ( let col = 1; col <= 10; ++col) {
        let code = this.myMap.get( rowVal + col).code;
        gridVal += code;
      };
    };
    console.log(this.getFormattedGrid());
    return gridVal;
  }

  getFormattedGrid() {
    let formattedGrid = '';

    for (let rowIndex = 0; rowIndex < 10; ++rowIndex) {
      let rowVal = this.rows[rowIndex];
      let row = '';
      for (let col = 1; col <= 10; ++col) {
        let code = this.myMap.get(rowVal + col).code;
        row += code;
      };
      formattedGrid += row + '\n';
    };
    return formattedGrid;
  }
};

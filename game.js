'use strict';

const uuid = require('uuid');

module.exports = class Game {

  constructor() {
    this.id = uuid.v4();
    this.lastRow = '';
    this.lastCol = 0;
    this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    // ship codes
    this.fleet = [
      {"type": 'carrier', "code": 1},
      {"type": 'battleship', "code": 2},
      {"type": 'cruiser', "code": 3},
      {"type": 'submarine', "code": 4},
      {"type": 'destroyer', "code": 5}
    ];

    // for My Map
    // '0' is for an empty location
    // '1' is for a ship type of '1'
    this.myMap = new Map();

    // for an Enemy Map
    // '-' is an untested location
    // 'X' is for a hit
    // '0' is for a miss
    // '*' is for a sunken ship
    this.enemyMap = new Map();

    this.initMaps();
    this.placeShips();

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

  placeShips() {
    // randomize whether we place the ship vertically or horizontally
    let placeVertical = Math.round(Math.random(10)) === 1;

    this.myMap.set('A1', {code: '1', isHit: false});
    this.myMap.set('A2', {code: '1', isHit: false});
    this.myMap.set('A3', {code: '1', isHit: false});
    this.myMap.set('A4', {code: '1', isHit: false});
    this.myMap.set('A5', {code: '1', isHit: false});

    this.myMap.set('B1', {code: '2', isHit: false});
    this.myMap.set('B2', {code: '2', isHit: false});
    this.myMap.set('B3', {code: '2', isHit: false});
    this.myMap.set('B4', {code: '2', isHit: false});

    this.myMap.set('C1', {code: '3', isHit: false});
    this.myMap.set('C2', {code: '3', isHit: false});
    this.myMap.set('C3', {code: '3', isHit: false});

    this.myMap.set('D1', {code: '4', isHit: false});
    this.myMap.set('D2', {code: '4', isHit: false});
    this.myMap.set('D3', {code: '4', isHit: false});

    this.myMap.set('E1', {code: '5', isHit: false});
    this.myMap.set('E2', {code: '5', isHit: false});
  }

  targetMyShot() {
    // choose a location at random to start
    // and save it to use for a strategy later
    this.lastRow = this.rows[Math.floor(Math.random(10) * 10)];
    this.lastCol = Math.ceil(Math.random(10) * 10);
    return ({row: this.lastRow, col: this.lastCol});
  }

  recordMyShotResult(shotResults) {
    this.enemyMap.set( this.lastRow + this.lastCol, shotResults);
  }

  checkIsSunk(location) {
    let code = location.code;
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
    let location = this.myMap.get(row+col);

    if(location.code === '0'){
      // missed
      return 0;
    } else {
      location.isHit = true;
      if (this.checkIsSunk(location) === true) {
        return 2;
      } else {
        return 1;
      }
    }
  }

  getGrid() {
    let gridVal = '';
    for (let rowIndex = 0; rowIndex < 10; ++rowIndex) {
      let rowVal = this.rows[rowIndex];
      for (let col = 1; col <= 10; ++col) {
        let code = this.myMap.get(rowVal + col).code;
        gridVal += code;
      };
    };
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

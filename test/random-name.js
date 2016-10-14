'use strict';

const Assert = require('assert');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

let randomNames = require('../util/random-name.js');

  lab.test('- it creates two random names', (done) => {

    Assert(randomNames() !== randomNames())
    done();
});

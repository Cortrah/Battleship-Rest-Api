'use strict';

// creates a random name like 'Joe 23'
module.exports = function randomName() {

    let names = [
        "Hondo", "Pufinstuf", "Hong Kong Phooey",
        "Inspector Gadget", "Alexi", "Franko", "Soupy",
        "Digdug", "Grouper", "Flayrah", "Joe"
    ];

    const randomIndex = Math.round(Math.random(10) * 10);
    return names[randomIndex] + ' ' +
        Math.round(Math.random(10) * 10) +
        Math.round(Math.random(10) * 10);
};

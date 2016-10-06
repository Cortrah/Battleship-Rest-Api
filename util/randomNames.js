'use strict';

module.exports = function randomName() {

  let names = [
    "Hondo","Pufinstuf", "Hong Kong Phooey",
    "Inspector Gadget", "Alexi","Franko", "Soupy",
    "Digdug", "Grouper","Flayrah"
  ];

  return names[Math.round(Math.random(10)*10)] + Math.round(Math.random(10)*10) + Math.round(Math.random(10)*10);
};

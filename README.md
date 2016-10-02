# Battleship

A code Kata for the Agnostechvalley group
https://github.com/agnostechvalley/katas/tree/master/2016-06

from the root battleship directory

	npm install

then to start the rest client server

	npm start 
	
to start a referee server that runs two players in a match
	
	node server.js

if you then go to localhost:4000/docs you can see the docs for the client rest api

if you then go to localhost:5000/docs you can see the docs for the referee server api

if you send a post request to http://pumpkin.local:5000/battleship/match you will see a match result

you can run the tests with

	npm test 

if you have a problem running the tests you may need to install lab globally in addition to locally with

	npm install -g lab


you can create a nicely formatted coverage.html file that you can view to see the test coverage

	npm run test-cov-html 






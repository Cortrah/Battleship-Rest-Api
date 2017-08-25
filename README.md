# Battleship Rest Api's

This project is a code Kata for the Agnostechvalley group
https://github.com/agnostechvalley/katas/tree/master/2016-06

The original spec and php referee server is here
https://github.com/restgames/battleship-client

It contains a javascript solution for the original challenge and a simple server to stub out matches between different instances of the client.

## A Javascript Solution

The client.js file of this repo is a restful api solution in javascript using node and hapi.

To run the client, clone the repository. And from the root battleship directory type

	npm install

Then to start the rest client server

	node client.js
	
	
Then if you go to localhost:4000/docs you can see the docs for the client rest api

I have no idea how to setup php but if you run the referee server and point it to port 4000 this client implements the spec.

You can see the tests in tests/client.js or run them with

	npm test 

If you have a problem running the tests you may need to install lab globally in addition to locally with

	npm install -g lab


You can create a nicely formatted coverage.html file that you can view to see the test coverage

	npm run test-cov-html 


## An Alternative Server
	
Since I don't know php I created a referee server that runs two players in a match

It doesn't go through the rigamarole of making rest calls it just runs two players locally

To start the server go to
	
	node server.js

if you then go to http://localhost:5000/docs you can see the docs for the referee server api

if you send a post request to http://localhost:5000/battleship/match you will see a match result

Alternatively you can create two players and have them play a match by just making a get call (loading the page) at

http://localhost:5000/battleship/api/init

Then if you go to the lobby you can see each players win loss record and their matches

http://localhost:5000/lobby

From here you can either create a new match or view the details for previous matches

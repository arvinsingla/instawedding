/**
 * @file
 * Primary Server JS for InstaWedding server.
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

// GET /style.css etc
app.use(express.static(__dirname + '/client'));

// accept POST request on the homepage
app.post('/', function (req, res) {
  res.send('Got a POST request');
  console.log("Got a POST request");
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

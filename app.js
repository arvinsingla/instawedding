/**
 * @file
 * Primary Server JS for InstaWedding server.
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ig = require('instagram-node').instagram();
var handlebars = require('handlebars');
var fs = require('fs');

// Initialize needed variables.
var hashTag = 'singlahabibtest';
var igMinId;
var source = "<div class='gradient'></div><img class='instagram-image' src='{{this.images.standard_resolution.url}}'><div class='user'><img src='{{this.user.profile_picture}}'><div class='user-text'><h4>{{this.user.full_name}}</h4><div class='caption'>{{this.caption.text}}</div></div>";
var template = handlebars.compile(source);

// Initialize instagram settings
var igSettings = JSON.parse(fs.readFileSync('igSettings.json', 'utf8'));
ig.use(igSettings);

// Tell the express server to listen on port 80
server.listen(80);

// Static GET to serve the client app.
app.use(express.static(__dirname + '/client'));

// Respond to requsts that include a hub challenge key.
app.get('/instagram', function (req, res) {

  // Our callback is a challenge.
  if (!!req.query['hub.challenge']) {
    res.send(req.query['hub.challenge']);
  }
  // Bail out.
  else {
    res.status(500).send('Wat!');
  }
});

// Socket.io connection.
io.on('connection', function (socket) {
  console.log('New client connected.');
  ig.tag_media_recent(hashTag, function(err, medias, pagination, remaining, limit) {
    updateClient(err, medias);
  });
});

// Incoming instagram posts.
app.post('/instagram', function (req, res) {
  console.log('New response from Instragram.')
  // Only execute updates if we have a minId.
  if (typeof(igMinId) !== 'undefined') {
    ig.tag_media_recent(hashTag, { min_tag_id: igMinId }, function(err, medias, pagination, remaining, limit) {
      updateClient(err, medias);
    });
  }
});

// Function to send data to the client if IG results were found.
var updateClient = function(err, medias) {
  var posts = [];
  if (err === null && medias.length !== 0) {
    medias.forEach(function(post) {
      posts.push(template(post));
    })
    io.sockets.emit('newPosts', { data: posts });
    igMinId = medias[0]['id'];
    console.log("Updated client with posts.");
  } else {
    console.log("No new posts retreived.")
  }
}

console.log("Ready for clients.");

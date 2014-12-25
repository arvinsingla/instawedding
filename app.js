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

// Every call to `ig.use()` overrides the `client_id/client_secret`
// or `access_token` previously entered if they exist.
ig.use({ client_id: '67a9d920bffb437c931859e765c422ee',
client_secret: 'ba80556943ef4c159d5ef1be8fa06e59' });

// Initialize needed variables
var igMinId;
var source = "<div class='gradient'></div><img class='instagram-image' src='{{this.images.standard_resolution.url}}'><div class='user'><img src='{{this.user.profile_picture}}'><div class='user-text'><h4>{{this.user.full_name}}</h4><div class='caption'>{{this.caption.text}}</div></div>";
var template = handlebars.compile(source);

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
    res.status(500).send('wat');
  }
});

// Socket.io connection.
io.on('connection', function (socket) {
  ig.tag_media_recent('pizza', function(err, medias, pagination, remaining, limit) {
    var posts = [];
    if (err === null) {
      medias.forEach(function(post) {
        posts.push(template(post));
      })
      socket.emit('newPosts', { data: posts });
      igMinId = medias[0]['id'];
    }
  });
});

// Incoming instagram posts.
app.post('/instagram', function (req, res) {
  // Only execute updates if we have a minId.
  if (typeof(igMinId) !== 'undefined') {
    console.log('New Post from Instagram. MinID = ' + igMinId);
    ig.tag_media_recent('pizza', { min_tag_id: igMinId }, function(err, medias, pagination, remaining, limit) {
      var posts = [];
      if (err === null) {
        medias.forEach(function(post) {
          posts.push(template(post));
        })
        io.sockets.emit('newPosts', { data: posts });
        igMinId = medias[0]['id'];
      }
    });
  }
});

/**
 * @file
 * Front end client for instawedding.
 */

/*
var socket = io('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/


var feed = new Instafeed({
  get: 'tagged',
  tagName: 'pizza',
  clientId: '67a9d920bffb437c931859e765c422ee',
  sortBy: 'most-recent',
  resolution: 'standard_resolution',
  template: '<li><div class="gradient"></div><img class="instagram-image" src="{{image}}" /><div class="user"><img src="{{model.user.profile_picture}}"><div class="user-text"><h4>{{model.user.username}}</h4><div class="caption">{{caption}}</div></div></div></li>',
  after: function(e) {
    // Initialize the flexslider with our instagram photos.
    jQuery('.flexslider').flexslider({
      animation: "slide",
      slideshow: true,
      useCSS: false,
      controlNav: false,
      directionNav: false
    });
  }
});

// Initialize the Instagram feed fetcher.
feed.run();

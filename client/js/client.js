/**
 * @file
 * Front end client for instawedding.
 */

var $slider;
var $current;
var socket = io('http://216.119.154.185');

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

(function($) {

  $current = $('.current');

  socket.on('newPosts', function (data) {
    var posts = '';
    if (typeof($slider) !== 'undefined') {
      data.data.forEach(function(post) {
        $slider.addSlide('<li>' + post + '</li>');
      });

    } else {
      data.data.forEach(function(post) {
        posts += '<li>' + post + '</li>';
      });
      $('.flexslider ul').append(posts);
      // Initialize the flex slider.
      $('.flexslider').flexslider({
        animation: "slide",
        slideshow: true,
        useCSS: false,
        initDelay: 0,
        allowOneSlide: true,
        slideshowSpeed: 5000,
        controlNav: false
      });
      $slider = $('.flexslider').data('flexslider');
    }
    $current.html(data.data[0]);
  });

  // Allow user to enter fullscreen mode.
  $(".title").on('click', function() {
    toggleFullScreen();
  })
})(jQuery)

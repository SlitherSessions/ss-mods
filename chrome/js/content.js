
var loader = document.createElement ('script');
loader.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
loader.onload = function() {
  document.head.innerHTML += '<link rel="stylesheet" href="http://mods.slithersessions.com/css/style.min.css">';
  var main = document.createElement ('script');
  main.src = 'http://mods.slithersessions.com/js/main.min.js';
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

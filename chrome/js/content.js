
var loader = document.createElement ('script');
loader.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
loader.onload = function() {
  document.head.innerHTML += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">';
  var main = document.createElement ('script');
  main.src = 'http://mods.slithersessions.com/js/main.min.js';
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

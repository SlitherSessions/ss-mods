
var loader = document.createElement ('script');
loader.src = chrome.extension.getURL ('/js/jquery.js');
loader.onload = function() {
  document.head.innerHTML += '<link rel="stylesheet" href="' + chrome.extension.getURL ('/css/style.min.css') + '">';
  var main = document.createElement ('script');
  main.src = chrome.extension.getURL ('/js/ss.min.js');
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

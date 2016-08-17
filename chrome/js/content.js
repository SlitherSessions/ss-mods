
var loader = document.createElement ('script');
loader.src = chrome.extension.getURL ('/js/jquery.js');
loader.onload = function() {
  document.head.innerHTML += '<link rel="stylesheet" href="' + chrome.extension.getURL ('/css/style.min.css') + '">';
  var main = document.createElement ('script');
  var ssScriptUrl = '/js/ss.min.js';
  // var ssScriptUrl = '/js/ss.js'; /* uncomment for debugging */
  main.src = chrome.extension.getURL (ssScriptUrl);
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

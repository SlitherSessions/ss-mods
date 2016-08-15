// ==UserScript==
// @name         Slither Sessions
// @namespace    mods.slithersessions.com
// @version      2.1.17
// @description  Slither Sessions Mod Pack
// @author       Kushview, LLC
// @require      http://code.jquery.com/jquery-latest.js
// @updateURL    http://mods.slithersessions.com/js/slithersessions.user.js
// @downloadURL  http://mods.slithersessions.com/js/slithersessions.user.js
// @match        http://slither.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var loader = document.createElement ('script');
loader.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
loader.onload = function() {
  document.head.innerHTML += '<link rel="stylesheet" href="http://mods.slithersessions.com/css/style.min.css">';
  var main = document.createElement ('script');
  main.src = 'http://mods.slithersessions.com/js/ss.min.js';
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

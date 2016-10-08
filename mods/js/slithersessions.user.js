/*
  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
// ==UserScript==
// @name         Slither Sessions
// @namespace    mods.slithersessions.com
// @version      2.2.5
// @description  Slither Sessions Mod Pack
// @author       Slither Sessions
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
  // main.src = 'http://mods.slithersessions.com/js/ss.js'; /* uncomment for debugging */
  main.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
};
(document.head || document.documentElement).appendChild (loader);

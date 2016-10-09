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

/** This is an example of how to notify a remote server with IP information. This
    requires server side scripting to fully implement.
  */

// ==UserScript==
// @name         SS Host Updater
// @namespace    mods.slithersessions.com
// @version      1.0.0
// @description  Slither Sessions Mod Pack
// @author       Slither Sessions
// @updateURL    http://mods.slithersessions.com/js/ss-host-updater.user.js
// @downloadURL  http://mods.slithersessions.com/js/ss-host-updater.user.js
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://slither.io
// @grant        none
// @run-at       document-end
// ==/UserScript==

var ssHostUpdateUrl = "http://example.com/update_slither_host.php";

function ssHostUpdaterInit () {
    if (typeof window.ss != 'undefined')
    {
        var ss = window.ss;
        ss.onHostChanged = function() {
            $.get (ssHostUpdateUrl, { host: ss.currentIp() },
              function (data) {
               ss.log ("[SS] remote host updated: " + data);
              })
            ;
        };

        return;
    }

    setTimeout (ssHostUpdaterInit, 300);
}

(function () {
    'use strict';
    ssHostUpdaterInit ();
})();

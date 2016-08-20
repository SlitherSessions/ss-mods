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
// @name         Slither Sessions No Mods Mod
// @namespace    mods.slithersessions.com
// @version      1.0.0
// @description  Slither Sessions Mod Pack
// @author       Slither Sessions
// @updateURL    http://mods.slithersessions.com/js/ss-no-mods.user.js
// @downloadURL  http://mods.slithersessions.com/js/ss-no-mods.user.js
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://slither.io
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {

var channel = {
  channelId: 'your_channel_id', // slither sessions
  apiKey: 'your_api_key',
  apiUrl: 'https://www.googleapis.com/youtube/v3',

  subCount: 0,
  subGoal: 1000,
  refreshMillis: 15 * 1000
};

function addSkins() {
  // add in skin overrides
  window.superSetSkin = window.setSkin;
  window.setSkin = function (s, i) {
    window.superSetSkin (s, i);
    if (i == 22) {
      s.rbcs = [ 9, 9, 9, 11, 11, 11 ]; // SS black and white
    }
  };
}

function addSubCount() {
  $(document.body).append('\
    <div id="slither-overlay"> \
      <div id="sub-counter"> \
        <span>Sub Goal:&nbsp;</span><span id="sub-count">0</span>&#47;<span id="sub-goal">150</span> \
      </div> \
    </div> \
  ');
  $('#sub-goal').html(channel.subGoal);
}

function updateSubCount() {
  var endpoint = channel.apiUrl + '/channels';

  $.get (endpoint,
    {
      id: channel.channelId,
      key: channel.apiKey,
      part: 'statistics'
    },
    function (r) {
      channel.subCount = r.items[0].statistics.subscriberCount;
      $('#sub-count').html (channel.subCount);
      console.log(channel.subCount);
    }
  );
}

function updateStats() {
  updateSubCount();
  setTimeout (updateStats, channel.refreshMillis);
}

function ssUpdateSubGoal() {
  $('#sub-goal').html (channel.subGoal);
}

function init() {
  addSkins();
  addSubCount();
  updateStats();
}

setTimeout (init, 1000);

})();

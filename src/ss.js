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

var ss = window.ss = (function() {
  return {
    clanTags: [ 'SS', 'JG', 'YT' ],
    mods: [],
    options: {
      leaderBoardTitle: 'Slither Sessions',
      rotateSkins: false,
      useLastHost: false
    },

    version: function() { return '2.2.1'; },

    isInt: function (n) {
      return !isNaN(n) && Number(n) === n && n % 1 === 0;
    },

    connect: function() {
      if (ss.options.useLastHost) {
        var host = ss.loadOption ('lastHost');
        if (host && host.length > 0) {
          var addy = host.split(':')[0].trim(),
              port = host.split(':')[1].trim();
          forceServer (addy, port);
        }
      }

      window.connect();
    },

    connectToHost: function() {
      defaultIp = ss.loadOption ('lastHost', '');
      eipaddr = prompt ('Enter the IP address:', defaultIp);
      if (eipaddr && eipaddr.indexOf(":") != -1 && eipaddr.indexOf(".") != -1) {
        ss.saveOption ('lastHost', eipaddr);
        var addy = eipaddr.split(':')[0].trim(),
            port = eipaddr.split(':')[1].trim();
        forceServer (addy, port);
        connect();
        ss.waitForSnake (function (s) {
          setSkin (s, ss.skins.skin);
        });
      }
    },

    currentIp: function() {
      return (typeof bso != 'undefined') ? bso.ip : false;
    },

    forceLastHost: function() { },

    register: function (mod) {
      ss.mods.push (mod);
      ss[mod.slug] = mod;
      return ss;
    },

    quit: function() {
      return window.userInterface.quit();
    },

    saveOption: function (key, val) {
      return window.userInterface.savePreference (key, val);
    },

    loadOption: function (key, d) {
      return window.userInterface.loadPreference (key, d);
    },

    onFrameUpdate: function() {
      if (! window.playing || window.snake === null) {
        $(userInterface.connect).fadeIn();
        return;
      }

      $(userInterface.connect).fadeOut();

      // customize leaderboard title
      if (typeof window.lbh != 'undefined' &&
            window.lbh.textContent != ss.options.leaderBoardTitle)
      {
        window.log ("[SS] Updated leaderboard title: " + ss.options.leaderBoardTitle);
        window.lbh.textContent = ss.options.leaderBoardTitle;
      }

      // save last host when it changes
      if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
          window.bso.ip + ':' + window.bso.po) {
          userInterface.overlays.serverOverlay.innerHTML =
              window.bso.ip + ':' + window.bso.po;
          ss.saveOption('lastHost', window.bso.ip + ':' + window.bso.po);
      }
    },

    waitForSnake: function (callback, retries) {
      if (! ss.isInt (retries))
        retries = 4;

      var r = 0;

      function _waitForSnake() {
        if (r > retries)
          return;

        if (! window.snake) {
          window.log('[SS] waiting for snake r=' + r + '...');
          ++r;
          setTimeout (_waitForSnake, 300);
          return;
        }

        callback (window.snake);
      }

      return _waitForSnake();
    },

    quit: function() {
      userInterface.quit();
    }
  };
})();

/*
  ss.js - This file is part of Slither Sessions Mods

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
  // var superConnect = window.connect;
  //
  // window.connect = function() {
  //   var result = superConnect();
  //
  //   var nextHost = ss.currentIp();
  //   if (nextHost && nextHost != ss.loadOption ('lastHost')) {
  //     userInterface.overlays.serverOverlay.innerHTML = nextHost;
  //     ss.saveOption ('lastHost', nextHost);
  //     if (typeof ss.onHostChanged != 'undefined')
  //       ss.onHostChanged();
  //   }
  //
  //   return result;
  // };

  return {
    clanTags: [ 'SS', 'JG', 'YT' ],
    mods: [],
    options: {
      leaderBoardTitle: 'Slither Sessions',
      rotateSkins: false,
      useLastHost: false
    },

    version: function() { return '2.2.5'; },

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

    /** Returns the current IP as provided by Slither */
    currentIp: function() {
      return (typeof bso != 'undefined') ? bso.ip + ":" + bso.po : false;
    },

    forceLastHost: function() {
      var host = ss.loadOption ('lastHost');
      if (host && host.length > 0) {
        var addy = host.split(':')[0].trim(),
            port = host.split(':')[1].trim();
        forceServer (addy, port);
      }
    },

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

    /** Sets background to the given image URL.
        Defaults to slither.io's internal background. */
    setBackground: function (url) {
        url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
        window.ii.src = url;
    },

    loadOption: function (key, d) {
      return window.userInterface.loadPreference (key, d);
    },

    log: function() {
      if (window.logDebugging)
          console.log.apply (console, arguments);
    },

    onFrameUpdate: function() {
      if (! window.playing || window.snake === null) {
        if (! $(userInterface.connect).is(':visible'))
          $(userInterface.connect).fadeIn();
        return;
      }

      // Botstatus overlay
      if (window.playing && window.snake !== null) {
          let oContent = [];

          oContent.push('fps: ' + userInterface.framesPerSecond.fps);

          // Display the X and Y of the snake
          oContent.push('x: ' +
              (Math.round(window.snake.xx) || 0) + ' y: ' +
              (Math.round(window.snake.yy) || 0));

          if (window.goalCoordinates) {
              oContent.push('target');
              oContent.push('x: ' + window.goalCoordinates.x + ' y: ' +
                  window.goalCoordinates.y);
              if (window.goalCoordinates.sz) {
                  oContent.push('sz: ' + window.goalCoordinates.sz);
              }
          }

          userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');

          if (userInterface.gfxOverlay) {
              let gContent = [];

              gContent.push('<b>' + window.snake.nk + '</b>');
              gContent.push(bot.snakeLength);
              gContent.push('[' + window.rank + '/' + window.snake_count + ']');

              userInterface.gfxOverlay.innerHTML = gContent.join('<br/>');
          }
      }

      if (window.playing && window.visualDebugging) {
          // Only draw the goal when a bot has a goal.
          if (window.goalCoordinates && bot.isBotEnabled) {
              var headCoord = { x: window.snake.xx, y: window.snake.yy };
              canvas.drawLine(
                  headCoord,
                  window.goalCoordinates,
                  'green');
              canvas.drawCircle(window.goalCoordinates, 'red', true);
          }
      }

      if ($(userInterface.connect).is(':visible'))
        $(userInterface.connect).fadeOut();

      // customize leaderboard title
      if (typeof window.lbh != 'undefined' && window.lbh.textContent != ss.options.leaderBoardTitle) {
        window.log ("[SS] Updated leaderboard title: " + ss.options.leaderBoardTitle);
        window.lbh.textContent = ss.options.leaderBoardTitle;
      }

      // save last host when it changes
      if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
          window.bso.ip + ':' + window.bso.po) {
          userInterface.overlays.serverOverlay.innerHTML = window.bso.ip + ':' + window.bso.po;
          ss.saveOption ('lastHost', window.bso.ip + ':' + window.bso.po);

          if (typeof ss.onHostChanged != 'undefined')
            ss.onHostChanged();
      }
    },

    /** Override this to react when the server address changes */
    onHostChanged: function() { },

    /** Wait for the player's snake to become available */
    waitForSnake: function (callback, retries) {
      if (! ss.isInt (retries))
        retries = 4;

      var r = 0;

      function _waitForSnake() {
        if (r > retries)
          return;

        if (! window.snake) {
          ss.log('[SS] waiting for snake r=' + r + '...');
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


var ss = window.ss = (function() {
  return {
    clanTags: [ 'SS', 'JG', 'YT' ],
    mods: [],
    options: {
      leaderBoardTitle: 'Slither Sessions',
      rotateSkins: false,
      useLastHost: false
    },

    version: function() { return '2.1.13'; },

    isInt: function (n) {
      return Number(n) === n && n % 1 === 0;
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

    loadOption: function (key, d) {
      return window.userInterface.loadPreference (key, d);
    },

    onFrameUpdate: function() {
      if (! window.playing || window.snake === null)
        return;

      // customize leaderboard title
      if (typeof window.lbh != 'undefined' &&
            window.lbh.textContent != ss.options.leaderBoardTitle)
      {
        window.log ("[SS] Updated leaderboard title: " + ss.options.leaderBoardTitle);
        window.lbh.textContent = ss.options.leaderBoardTitle;
      }
    },

    test: function() {
      if (window.sos) {
        console.log(sos[0]);
        var lobbyIds = []
        for (var i = 0; i < window.sos.length; ++i) {
          obj = window.sos[i];
          if (lobbyIds.indexOf (obj.ac) >= 0)
            console.log("alredy included");
          lobbyIds.push(obj.ac);
        }
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
    }
  };
})();

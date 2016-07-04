var ss = window.ss = (function() {
  return {
    clanTags: [ 'SS', 'YT' ],

    connectToHost: function() {
      defaultIp = userInterface.loadPreference ('lastHost', '');
      eipaddr = prompt ('Enter the IP address:', defaultIp);
      if (eipaddr && eipaddr.indexOf(":") != -1 && eipaddr.indexOf(".") != -1) {
          var addy = eipaddr.split(':')[0].trim(),
              port = eipaddr.split(':')[1].trim();
          forceServer (addy, port);
          connect();
      }
    },

    quit: function() {
      return window.userInterface.quit();
    },

    saveOption: function (key, val) {
      return window.userInterface.savePreference (key, val);
    },

    version: function() { return '2.0.1'; },

    onFrameUpdate: function() {
      if (!window.playing || window.snake === null)
        return;

      // save the last known IP address
      if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
          window.bso.ip + ':' + window.bso.po) {
          var slitherHost = window.bso.ip + ':' + window.bso.po;
          ss.saveOption ('lastHost', slitherHost)
      }

      // customize leaderboard title
      if (typeof window.lbh != 'undefined') {
          window.lbh.textContent = "Slither Sessions";
      }
    }
  };
})();

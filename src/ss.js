
tags = ['SS', 'YT'];

options = {
  'zoom': false,
  'clans': true,
  'custombg': false,
  'parties': true,
  'lowergph': false,
  'skinrotator': true,
  'background': '',
  'nick': '',
  'clantag': '',
  'drawfood': false,
  'drawfoodsize': 1,
  'drawfoodcolor': 1,
  'drawfoodcrazie': false,
  'showshortcuts': false,
  'chat': false
};

var ss = {
  options: {
    leaderBoardTitle: 'Slither Sessions'
  },

  mods: [],

  register: function (mod) {
    ss.mods.push (mod);
    return ss;
  },

  currentIp: function() {
    return (typeof bso != 'undefined') ? bso.ip : false;
  },

  isInt: function (n) {
    return Number(n) === n && n % 1 === 0;
  },

  numSkins: function() {
    return 25;
  },

  loop: function() {
    if (typeof lbh != 'undefined') {
      lbh.textContent = ss.options.leaderBoardTitle;
    }

    if (typeof bso != "undefined" && $("#ss-ip-address").html() != (bso.ip + ":" + bso.po)) {
      $("#ss-ip-address").html (bso.ip + ":" + bso.po);
      localStorage['lastIp'] = bso.ip;
      localStorage['lastPort'] = bso.po;
    }

    ss.mods.forEach (function (mod, i, a) {
      if (typeof mod.loop != 'undefined')
        mod.loop();
    });

    setTimeout (ss.loop, 1000);
  }
};

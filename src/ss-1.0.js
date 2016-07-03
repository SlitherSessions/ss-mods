
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
    leaderBoardTitle: 'Slither Sessions',
    mobileRender: false
  },

  mods: [],

  register: function (mod) {
    ss.mods.push (mod);
    return ss;
  },

  removeLogo: function() {
    if (typeof window.showlogo_iv !== 'undefined') {
      window.ncka = window.lgss = window.lga = 1;
      clearInterval (window.showlogo_iv);
      showLogo (true);
    }
  },

  setMobileRendering: function (mobileRendering) {
    window.mobileRender = mobileRendering;
    ss.setOption ('mobileRender', window.mobileRender);

    if (window.mobileRender) {
      window.render_mode = 1;
      window.want_quality = 0;
      window.high_quality = false;
    } else {
      window.render_mode = 2;
      window.want_quality = 1;
      window.high_quality = true;
    }
  },

  setOption: function (key, val) {
    ss.options[key] = val;
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

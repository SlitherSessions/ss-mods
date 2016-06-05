
tags = ['AG', 'HERO', 'MG', 'SS', 'YT'];

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

opts = {
  // 'Zoom': 'zoom',
  'Clan tag list': 'clans',
  // 'Custom background': 'custombg',
  'Party mode': 'parties',
  'Lower graphics': 'lowergph',
  'Skin rotator': 'skinrotator'
};

function set (a, b) {
  options[a] = b;
}

String.prototype.isJSON = function() {
  try {
    JSON.parse (this);
  } catch (e) {
    return false;
  }

  return true;
};

if (! localStorage['slitherSessions'] || (localStorage['slitherSessions'].isJSON() && !JSON.parse(localStorage['slitherSessions']).hasOwnProperty("drawfood"))) {
  localStorage['slitherSessions'] = JSON.stringify (options);
} else if (localStorage['slitherSessions'].isJSON()) {
  options = JSON.parse(localStorage['slitherSessions']);
}

function asciize (b, typing) {
  var h, c, f;
  c = b.length;
  var w = !1;
  for (h = 0; h < c; h++)
    if (f = b.charCodeAt(h), 32 > f || 127 < f) {
      w = !0;
      break
    }
  if (w) {
    w = "";
    for (h = 0; h < c; h++) f = b.charCodeAt(h), w = 32 > f || 127 < f ? w + " " : w + String.fromCharCode(f);
    return w
  }

  if (! typing) {
    window.options.nick = $("#nick").val();
    window.options.clantag = $("#tag").val();
    localStorage['slitherSessions'] = JSON.stringify (window.options);
  }

  return window.options.clans && !typing ? jQuery("#tag").val() + ' ' + b : b;
}

function addIpSelect() {
  $('#playh').before (
    '<div id="ss-ip-select" class="taho"><select class="sumsginp" id="ss-ip"></select></div>'
  );

  box = $('#ss-ip');
  box.append("<option value=''>Random Server</option>");
}

function addClanTags() {
  $('.taho').before (
    '<div id="ss-tag-holder" class="taho"><select class="sumsginp" id="tag"></select></div>'
  );

  nick.oninput = function() {
    var b = this.value;
    var h = asciize (b, true);
    24 < h.length && (h = h.substr (0, 24));
    b != h && (this.value = h);
  };

  $('#tag').append("<option value=''>---</option>");
  for (var i = 0; i < tags.length; ++i) {
    var tag = tags[i];
    $("#tag").append("<option value='[" + tag + "]'>[" + tag + "]</option>");
  }
}

function setLowerGraphics (a) {
  if (a) {
    render_mode = 1;
  } else {
    render_mode = 2;
  }
}

function resizeView() {
  $("#login").css('margin-top', '0px');
  if (window.resize) {
    window.lww = 0;
    window.wsu = 0;
    window.resize();
    var wh = Math.ceil(window.innerHeight);
    if (wh < 800) {
      var login = document.getElementById("login");
      window.lgbsc = wh / 800;
      login.style.top = - (Math.round(wh * (1 - window.lgbsc) * 1E5) / 1E5) + "px";
      if (window.trf) {
        window.trf(login, "scale(" + window.lgbsc + "," + window.lgbsc + ")");
      }
    }
  } else {
    setTimeout (resizeView, 100);
  }
}

function showFPS() {
  $('body').append('<div id="ss-fps-box">FPS: <span id="ss-fps-value">0</span></div>');
}

function updateFPS() {
  if (typeof playing != 'undefined' && playing && fps && lrd_mtm) {
    if (Date.now() - lrd_mtm > 970) {
      $("#ss-fps-value").html (fps);
    }
  }

  setTimeout (updateFPS, 100);
}

function initFPS() {
  showFPS();
  updateFPS();
}

function checkForMods() {
  if ($("#ip-hud").length != 0 || $("#worms").length != 0 || $("#login").html().toLowerCase().indexOf("mods.slithersessions.com") != -1) {
    $("body").html("<div style='text-align:center;width:100%;position:absolute;top:50%;margin-top:-98px;color:rgb(128, 88, 208);'><img src='s/favicon.png'/><h1>Please disable other slither.io extensions to use Slither Sessions.</h1></div>");
    return;
  }

  if (!$('#psk').is(':visible') && snake && snake.rcv != localStorage.snakercv && !options['skinrotator']) {
    setSkin (snake, localStorage.snakercv);
  }
}

addClanTags();
jQuery("#tag").val(options.clantag);
jQuery("#nick").val(options.nick);
resizeView();
initFPS();
ss.loop();

$('body').append('<div id="ss-ip-box">IP: <span id="ss-ip-address">play first</span> \
                    <label id="ss-ip-connect" class="on">Connect to IP</label> \
                  </div>');

$("#ss-ip-connect").click (function() {
  eipaddr = prompt ('Enter the IP address:', '');
  if (eipaddr && eipaddr.indexOf(":") != -1 && eipaddr.indexOf(".") != -1) {
    forceServer (eipaddr.split(":")[0], eipaddr.split(":")[1]);
    connect();
  }
});

$('#playh .btnt.nsi.sadg1').click (function() {
  setTimeout (function() {
    if ((!ws || ws.readyState != ws.OPEN) && window.bso.ip == ss.currentIp()) {
      alert ('Server is full! Looking for a new server...');
      document.location.href = 'http://slither.io/';
    }
  }, 4000);
});

$(function() {
  $('iframe').attr('src', 'http://mods.slithersessions.com/social.html');
  setInterval (checkForMods, 1000);
});

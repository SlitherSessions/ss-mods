
tags = [
  "AG",
  "HERO",
  "NBK",
  "MG",
  "SS",
  "YT"
];

options = {
  'zoom': false,
  'clans': true,
  'custombg': false,
  'parties': true,
  'lowergph': false,
  'skinrotator': false,
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
}



if (!localStorage["slitherplus"] || (localStorage["slitherplus"].isJSON() && !JSON.parse(localStorage["slitherplus"]).hasOwnProperty("drawfood"))) {
  localStorage["slitherplus"] = JSON.stringify(options);
} else if (localStorage["slitherplus"].isJSON()) {
  options = JSON.parse(localStorage["slitherplus"]);
}

opts = {
  "Zoom": 'zoom',
  "Clan tag list": 'clans',
  "Custom background": 'custombg',
  "Party mode": 'parties',
  "Lower graphics": 'lowergph',
  "Skin rotator": 'skinrotator'
};

function zoom (e) {
  if (! window.gsc) {
    return;
  }
  if (!options.zoom) { window.gsc = 0.9; return; }
  window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
  window.gsc > 2 ? window.gsc = 2 : window.gsc < 0.1 ? window.gsc = 0.1 : null;
}

function addParty() {
  $("#playh").after('<div id="party" style="margin: auto; width: 200px; display: block !important; margin-bottom: 25px"><div class="btn-group" style="width: 100%"><button class="btn btn-success" id="createParty" style="width: 50%">Create</button><button style="width: 50%" class="btn btn-primary" id="joinParty">Join</button></div><input id="partyCode" placeholder="Party Code" class="form-control" type="text" style="width: 100%;color:black;text-align:center;font-weight:bold;box-shadow:inset 0 0 3px #000;"></div>');
  $(".btnt.nsi.sadg1:first").css('margin-bottom', '35px');

  jQuery("#createParty").click (function (e) {
    if (! window.bso) {
      $("#partyCode").val ("click play");
      setTimeout(function() {
        $("#partyCode").val ('');
      }, 1000);
      return;
    }

    $.get("http://51.254.206.4:8080/create/" + window.bso.ip + ':' + window.bso.po, function(data) {
      $("#partyCode").val(data);
      forceServer(window.bso.ip, window.bso.po);
      document.location.href = "http://slither.io/#" + data;
    });
    return false;
  });

  jQuery("#joinParty").click(function(e) {
    if ($("#partyCode").val() == '') {
      window.forcing = false;
      getData("/i49526.txt", o);
    } else {
      $.get("http://51.254.206.4:8080/join/" + $("#partyCode").val(), function(data) {
        if (data == 'error') {
          $("#partyCode").val('wrong code');

          setTimeout (function() {
            $("#partyCode").val('');
          }, 1000);
        } else {
          srv = data.split(":");
          forceServer(srv[0], srv[1]);
        }
      });
    }
    return false;
  });

  $("#createParty").css('border-bottom-left-radius', '0');
  $("#joinParty").css('border-bottom-right-radius', '0');
  $("#partyCode").css('border-top-left-radius', '0');
  $("#partyCode").css('border-top-right-radius', '0');
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
    localStorage["slitherplus"] = JSON.stringify (window.options);
  }

  return window.options.clans && !typing ? jQuery("#tag").val() + ' ' + b : b;
}

function addClanTags() {
  jQuery(".taho").before('<div id="tag_holder" class="taho" style="width: 110px; height: 40px; margin-top: 10px; box-shadow: rgb(0, 0, 0) 0px 6px 50px; opacity: 1; background: rgb(76, 68, 124);"><select class="sumsginp" id="tag" style="width: 85px; top: 0px; outline: 0; height: 35px; padding: 5px; border-radius:29px"></select></div>')

  nick.oninput = function(){var b=this.value,h=asciize(b,true);24<h.length&&(h=h.substr(0,24));b!=h&&(this.value=h)};

  jQuery("#tag").append("<option value='' style='background: rgb(76, 68, 124)'>-</option>");
  for (tag of tags) {
    jQuery("#tag").append("<option value='[" + tag + "]' style='background: rgb(76, 68, 124)'>[" + tag + "]</option>");
  }
}

if (/firefox/i.test(navigator.userAgent)) {
  document.addEventListener("DOMMouseScroll", zoom, false);
} else {
  document.body.onmousewheel = zoom;
}

function setBackground (url) {
  return; // FIXME
  ii.src = url;
}

function setLowerGraphics(a) {
  if (a) {
    setBackground('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AQYBigs0bXWaQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAADUlEQVQI12P4//8/AwAI/AL+XJ/P2gAAAABJRU5ErkJggg==');
    render_mode = 1;
  } else {
    if (! options.custombg) {
      setBackground();
    } else {
      setBackground (options.background);
    }
    render_mode = 2;
  }
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function skinRotator(i) {
  if (! isInt (i))
    i = 0;

  if (typeof ws != "undefined" && options.skinrotator && !$("#psk").is(":visible") && typeof snake != "undefined" && snake != null) {
    setSkin (snake, i++);
  }

  if (i > (25 + 16)) i = 0;
  setTimeout(skinRotator, 1000, i);
}

function addOptions() {
  jQuery("#saveh").after('<div id="options" style="width: 260px; color: rgb(128, 88, 208); border-radius: 29px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; margin: 0px auto 100px; padding: 10px 14px; background-color: rgb(30, 38, 46);"></div>');
  for (option in opts) {
    if (option == "Clan tag list" || option == "Party mode") {
      continue;
    }
    jQuery("#options").append('<div class="option"><span>' + option + '</span><label id="' + opts[option] + '" class="' + (options[opts[option]] ? 'on' : 'off') + '">' + (options[opts[option]] ? 'ON' : 'OFF') + '</label></div>');
    jQuery("#" + opts[option]).click(function() {
      if (jQuery(this).attr('class') == 'on') {
        jQuery(this).attr('class', 'off');
        jQuery(this).html('OFF');
        set(jQuery(this).attr('id'), false);
      } else {
        jQuery(this).attr('class', 'on');
        jQuery(this).html('ON');
        set(jQuery(this).attr('id'), true);
      }
    });
  }

  jQuery("#lowergph").click(function() {
    setLowerGraphics(jQuery(this).attr('class') == 'on');
  });

  jQuery("#custombg").click(function() {
    if (jQuery(this).attr('class') == 'on') {
      options.custombg = false;
      url = prompt('Enter new URL (image):', '');
      if (url && url.length > 10) {
        options.custombg = true;
        options.background = url;
        setBackground(url);
      } else {
        options.background = '';
        setBackground();
        jQuery("#custombg").attr('class', 'off');
        jQuery("#custombg").html('OFF');
      }
    } else {
      options.background = '';
      setBackground();
    }
  });

  jQuery(".option").attr('style', 'color: rgb(128, 88, 208); border-radius: 29px; margin: 10px auto; padding: 8px; background-color: rgb(76, 68, 124)');
  jQuery(".option > span").attr('style', 'height: 24px; color: rgb(224, 224, 255); margin-left: 5px');
  jQuery(".option > label").attr('style', 'float: right; width: 67px; text-align: center; border-radius: 12px; color: white; cursor: pointer; padding: 0px 20px;');
  jQuery("head").append("<style type='text/css'>label.on{background-color: rgb(86, 172, 129)}label.off{background-color:#861B1B}</style>");

  jQuery("#tag").val(options.clantag);
  jQuery("#nick").val(options.nick);
  $("#options").append('<label id="showshortcuts" class="on" style="text-align: center; border-radius: 12px; color: white; cursor: pointer; padding: 0px 20px; width:100%">Show shortcuts</label>');
  $("#options").append('<label id="showchat" class="on" style="text-align: center; border-radius: 12px; color: white; cursor: pointer; padding: 0px 20px; width:100%">Show chat</label>');
  $("body").append('<div id="shortcuts" style="display:none;z-index:999;width: 260px; color: rgb(128, 88, 208); border-radius: 29px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; margin: 0px auto 100px; padding: 10px 14px; background-color: rgba(30, 38, 46,0.7);position:absolute;top:50px;left:6px;"><ul style="list-style-type:none;padding:0;"><li>[F] - switch drawing mode</li><li>[G] - change color of drawing</li><li>[H] - change size of drawing</li><li>[J] - crazy drawing</li><li>[E] - previous skin</li><li>[R] - next skin</li><li>[Q] - quit</li><li>[ESC] - respawn</li><li>[SHIFT] - accelerate</li><li>[1-6] - switching options</li></ul></div>');
  $("body").append('<div id="chat" style="display:none;z-index:999; width: 260px; height: 270px; color: rgb(128, 88, 208); border-radius: 29px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; padding: 10px 14px; background-color: rgba(30, 38, 46,0.7);position:absolute;bottom:110px;left:6px;"><div id="chatMessages" style="height:200px"></div><div id="yourMessage_holder" class="taho" style="width: 100%; height: 35px; margin-top: 10px; box-shadow: rgb(0, 0, 0) 0px 6px 50px; opacity: 1; background: rgb(76, 68, 124);"><input class="sumsginp" id="yourMessage" placeholder="Press [ENTER] to chat" style="width: 100%; top: 0px; outline: 0; height: 35px; padding: 10px; left:0; border-radius:29px;font-size:14px" /></div></div>');
  $("#showshortcuts").click(function() {
      if (jQuery(this).attr('class') == 'on') {
        jQuery(this).attr('class', 'off');
        jQuery(this).html('Hide shortcuts');
        set(jQuery(this).attr('id'), false);
        $("iframe").attr('src','data:html,');
        $("#shortcuts").show();
        options['showshortcuts'] = true;
      } else {
        jQuery(this).attr('class', 'on');
        jQuery(this).html('Show shortcuts');
        set(jQuery(this).attr('id'), true);
        $("iframe").attr ('src', 'http://slither.kushview.net/social.html');
        $("#shortcuts").hide();
        options['showshortcuts'] = false;
      }
  });
  $("#showchat").click(function() {
      if (jQuery(this).attr('class') == 'on') {
        jQuery(this).attr('class', 'off');
        jQuery(this).html('Hide chat');
        $("#chat").show();
        options['chat'] = true;
      } else {
        jQuery(this).attr('class', 'on');
        jQuery(this).html('Show chat');
        $("#chat").hide();
        options['chat'] = false;
      }
  });

  $("body").append('<div id="fpsBox" style="position:fixed;bottom: 160px; right: 20px; color: lightgray; z-index:99999999;">FPS: <span id="fps">waiting...</span></div>');
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
    setTimeout(resizeView, 100);
  }
}

function addKeyEvents() {
  options['drawfood'] = false;
  $(document).keydown (function (e) {
    switch (e.keyCode) {
      case 27:
if ($("#yourMessage").is(":focus")) { return; }
        if (typeof bso != "undefined") {
          forcing = true;
          connect();
        }
        break;
      case 9:
        e.preventDefault();
        $("#ipBox").toggle();
        $("#fpsBox").toggle();
        break;
      case 71:
        if ($("#yourMessage").is(":focus")) { return; }
        if (options['drawfoodcolor'] >= 7) {
          options['drawfoodcolor'] = 0;
        }
        options['drawfoodcolor']++;
        break;
      case 70:
      if ($("#yourMessage").is(":focus")) { return; }
        options['drawfood'] = !options['drawfood'];
        if (options['drawfood']) {
          drawFood = setInterval(function(){
            try {
              if (!options['drawfoodcrazie']) {
                if (options['drawfoodcolor'] != 7) {
                  newFood(3, snake.xx, snake.yy, options['drawfoodsize'],5, options['drawfoodcolor']);
                } else if (options['drawfoodcolor'] == 7) {
                  newFood(3, snake.xx, snake.yy, options['drawfoodsize'], 5, Math.floor(Math.random() * 7) + 1);
                }
              } else {
                newFood(3, snake.xx, snake.yy, Math.floor(Math.random() * 20) + 1, 5, Math.floor(Math.random() * 7) + 1);
              }
            } catch(err) {}
          }, 100);
        } else {
          clearInterval(drawFood);
        }
        break;
      case 72:
      if ($("#yourMessage").is(":focus")) { return; }
        if (options['drawfoodsize'] >= 20) {
          options['drawfoodsize'] = 0;
        }

        options['drawfoodsize'] += 2;
        break;
      case 74:
        if ($("#yourMessage").is(":focus")) { return; }
        options['drawfoodcrazie'] = !options['drawfoodcrazie'];
        break;
      case 69:
        if ($("#yourMessage").is(":focus")) { return; }
        $("#psk").click();
        break;
      case 82:
        if ($("#yourMessage").is(":focus")) { return; }
        $("#nsk").click();
        break;
      case 13:
        if ($("#chat").is(":visible")) {
          if ($("#yourMessage").is(":focus")) {
            chatWebSocket.send(JSON.stringify({ action: 1, nick: $("#nick").val(), message: $("#yourMessage").val(), color: (snake ? snake.cs : "#FFFFFF") }));
            $("#yourMessage").blur();
            $("#yourMessage").val('');
          } else {
            $("#yourMessage").focus();
          }
        }
        break;
      case 81:
if ($("#yourMessage").is(":focus")) { return; }
        if (playing) {
          want_close_socket = -1;
          dead_mtm = Date.now() - 5E3;
          ws.close();
          ws = null;
          playing = !1;
          connected = !1;
          resetGame();
          play_btn.setEnabled(!0);
        }
        break;
      case 16:
if ($("#yourMessage").is(":focus")) { return; }
        setAcceleration(true);
        break;
      case 49:
if ($("#yourMessage").is(":focus")) { return; }
        $("#zoom").click();
        break;
      case 50:
if ($("#yourMessage").is(":focus")) { return; }
        $("#custombg").click();
        break;
      case 51:
if ($("#yourMessage").is(":focus")) { return; }
        $("#lowergph").click();
        break;
      case 52:
if ($("#yourMessage").is(":focus")) { return; }
        $("#skinrotator").click();
        break;
      case 53:
if ($("#yourMessage").is(":focus")) { return; }
        $("#showshortcuts").click();
        break;
      case 54:
if ($("#yourMessage").is(":focus")) { return; }
        $("#showchat").click();
        break;
    }
  });
  $(document).keyup(function(e) {
    switch (e.keyCode) {
      case 16:
        setAcceleration(false);
        break;
    }
  });
}

function showFPS() {
  if (typeof playing != "undefined" && playing && fps && lrd_mtm) {
    if (Date.now() - lrd_mtm > 970) {
      $("#fps").html(fps);
    }
  }

  setTimeout (showFPS, 30);
}

function loop() {
  if (typeof lbh != 'undefined') {
    lbh.textContent = 'Slither Sessions';
  }

  if (typeof bso != "undefined" && $("#ipAddress").html() != (bso.ip + ":" + bso.po)) {
    $("#ipAddress").html(bso.ip + ":" + bso.po);
    chatWebSocket.send(JSON.stringify({ action: 0, token: (bso.ip + ":" + bso.po) }));
  }

  setTimeout (loop, 1000);
}

$("body").append('<div id="ipBox" style="position:fixed;bottom: 120px; right: 20px; color: lightgray; z-index:99999999;">IP: <span id="ipAddress">play first</span> <label style="float: right;text-align: center; border-radius: 12px; color: white; cursor: pointer; padding: 0px 20px;width: 140px; margin-left: 10px;" id="ip-connect" class="on">Connect to IP</label></div>');

$("#ip-connect").click(function() {
  eipaddr = prompt('Enter the IP address:', '');
  if (eipaddr && eipaddr.indexOf(":") != -1 && eipaddr.indexOf(".") != -1) {
    forceServer(eipaddr.split(":")[0], eipaddr.split(":")[1]);
    connect();
    $("#partyCode").val('');
  }
});

if (document.location.href.indexOf("#") != -1) {
  $.get("http://51.254.206.4:8080/join/" + document.location.href.substr(document.location.href.indexOf("#")+1,6), function(data) {
    if (data == 'error') {
      $("#partyCode").val('wrong code');

      setTimeout(function() {
        $("#partyCode").val('');
      }, 1000);
    } else {
      $("#partyCode").val(document.location.href.substr(document.location.href.indexOf("#")+1,6));
      srv = data.split(":");
      forceServer (srv[0], srv[1]);
    }
  });
}

function checkForMods() {
  if ($("#ip-hud").length != 0 || $("#worms").length != 0 || $("#login").html().toLowerCase().indexOf("slitherio.org") != -1) {
    $("body").html("<div style='text-align:center;width:100%;position:absolute;top:50%;margin-top:-98px;color:rgb(128, 88, 208);'><img src='s/favicon.png'/><h1>Please disable other slither.io extensions to use SlitherPlus.</h1></div>");
    return;
  }

  if (!$("#psk").is(":visible") && snake && snake.rcv != localStorage.snakercv && !options['skinrotator']) {
    setSkin(snake, localStorage.snakercv);
  }
}

function addSkins() {
  window.setSkin = (function() {
    var
      // Get amount of original skins.
      originalMaxSkinCv = max_skin_cv,
      // Save original setSkin function.
      originalSetSkin = setSkin,
      // Array with new skins.
      newSkins = [
        [11, 7, 7, 11, 11, 11, 9, 9],
        [4, 3, 3, 4, 4, 4],
        [5, 5, 7, 5, 22, 22, 4, 4, 22, 22, 5, 5, 9, 9],
        [16, 16, 16, 16, 7, 7, 7, 9, 9, 10, 10, 10, 9, 9, 7, 7, 7],
        [12, 7, 7, 7, 7, 9, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        [11, 9, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        [16, 16, 7, 7, 7, 7, 9, 11, 7, 7, 7, 7, 16],
        [3, 3, 3, 9, 11, 9],
        [11,11,18,18], // dordmund (grey yellow)
        [21,21,7,7], // bayermunih (red blue)
        [11,11,7,7], // milan (red grey)
        [11,11,1,1], // inter (red grey)
        [11,11,9,9], // besiktas (white black)
        [18,18,21,21], // fenerbahce (blue yellow)
        [18,18,7,7], // galatasaray (red yellow)
        [21,21,1,1], // mancity (blue lowblue)
        [21,21,8,8], // barcelona (red blue)
        [21,21,21,9,7,9], // paris saint germain (red blue)
        [11, 9, 11, 7, 7, 7], // Mexican Kingsnake
        [11, 9, 11, 4, 4, 4], // Mexican Kingsnake
        [11, 9, 11, 5, 5, 5], // Mexican Kingsnake
        [11, 9, 11, 23, 23, 23], // Mexican Kingsnake
        [12, 13, 14, 15, 16, 17, 18, 21, 22, 23], //Test 2
        [12, 11, 22, 22, 23, 23, 12], // Nice colors
        [11],
        [25],// fullcolor green
        [21] //full color blue
      ];
    max_skin_cv += newSkins.length;

    return function (snake, skinId) {
      originalSetSkin(snake, skinId);
      if (skinId > originalMaxSkinCv) {
        var c,
          checkSkinId = skinId - originalMaxSkinCv - 1;
        if (newSkins[checkSkinId] !== undefined) {
          c = newSkins[checkSkinId];
        } else {
          skinId %= 9;
        }
        c && (skinId = c[0]);
        snake.rbcs = c;
        snake.cv = skinId;
      }
    };
  })();
}

addParty();
addClanTags();
skinRotator();
addOptions();
resizeView();
addKeyEvents();
showFPS();
loop();

$(function() {
  if (options.custombg && ii.src != options.background) {
    setBackground (options.background);
  }
  $("iframe").attr('src', 'http://slither.kushview.net/social.html');
  if (options['showshortcuts']) $("#showshortcuts").click();
  if (options['chat']) $("#showchat").click();

  setLowerGraphics(options['lowergph']);

  setSkin(snake, 0)
  setTimeout(addSkins, 1000);
  setInterval(checkForMods, 1000);
});

function msgsHeight() {
  msgs = $(".chatMessage").toArray();
  height = 0;
  for (key in msgs) { div = msgs[key]; height += div.clientHeight }
  return height;
}

function deleteMessages() {
  if (msgsHeight() > $("#chatMessages").height()) { $(".chatMessage:first").remove(); deleteMessages(); }
}
chatWebSocket = new WebSocket("ws://51.254.206.49:1337");
chatWebSocket.onopen = function() {
  $(".chatMessage").remove();
  $("#chatMessages").append('<div class="chatMessage"><span style="color:green;">Welcome to the chat!</span></div>');
};
chatWebSocket.onmessage = function(msg) {
  $("#chatMessages").append(msg.data);
  deleteMessages();
};
chatWebSocket.onerror = function(err) {
  $("#chatMessages").append('<div class="chatMessage"><span style="color:orange;">Got an error.</span></div>');
  deleteMessages();
};
chatWebSocket.onclose = function() {
  $("#chatMessages").append('<div class="chatMessage"><span style="color:red;">Chat closed.</span></div>');
  deleteMessages();
};

$("#playh .btnt.nsi.sadg1").click(function() {
  setTimeout(function(ip){
    if ((!ws || ws.readyState != ws.OPEN) && window.bso.ip == ip) {
      alert("Server is full! Looking for a new server...");
      document.location.href = "http://slither.io/";
    }
  }, 10000, window.bso.ip);
});

/*
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-76843908-1', 'auto');
  ga('send', 'pageview');
  */

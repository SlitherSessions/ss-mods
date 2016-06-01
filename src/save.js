function addKeyEvents() {
  options['drawfood'] = false;
  jQuery(document).keydown (function (e) {
    // console.log('key: ' + e.keyCode);
    switch (e.keyCode) {
      case 27:
        if (typeof window.bso != 'undefined') {
          forcing = true;
          connect();
        }
        break;
      case 9:
        e.preventDefault();
        $("#ss-ip-box").toggle();
        $("#ss-fps-box").toggle();
        break;
      case 71:
        if (options['drawfoodcolor'] >= 7) {
          options['drawfoodcolor'] = 0;
        }
        options['drawfoodcolor']++;
        break;
      case 70:
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
        if (options['drawfoodsize'] >= 20) {
          options['drawfoodsize'] = 0;
        }

        options['drawfoodsize'] += 2;
        break;
      case 74:
        options['drawfoodcrazie'] = !options['drawfoodcrazie'];
        break;
      case 69:
        $("#psk").click();
        break;
      case 82:
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
        setAcceleration(true);
        break;
      case 49:
        $("#zoom").click();
        break;
      case 50:
        $("#custombg").click();
        break;
      case 51:
        $("#lowergph").click();
        break;
      case 52:
        $("#skinrotator").click();
        break;
      case 53:
        $("#showshortcuts").click();
        break;
      case 54:
        $("#showchat").click();
        break;
    }
  });
  $(document).keyup(function(e) {
    switch (e.keyCode) {
      case 16:
        setAcceleration (false);
        break;
    }
  });
}

function addOptions() {
  jQuery("#saveh").after('<div id="options" style="width: 260px; color: rgb(128, 88, 208); border-radius: 6px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; margin: 0px auto 100px; padding: 10px 14px; background-color: rgb(30, 38, 46);"></div>');
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

  jQuery(".option").attr('style', 'color: rgb(128, 88, 208); border-radius: 6px; margin: 10px auto; padding: 8px; background-color: rgb(76, 68, 124)');
  jQuery(".option > span").attr('style', 'height: 24px; color: rgb(224, 224, 255); margin-left: 5px');
  jQuery(".option > label").attr('style', 'float: right; width: 67px; text-align: center; border-radius: 4px; color: white; cursor: pointer; padding: 0px 20px;');
  jQuery("head").append("<style type='text/css'>label.on{background-color: rgb(86, 172, 129)}label.off{background-color:#861B1B}</style>");

  jQuery("#tag").val(options.clantag);
  jQuery("#nick").val(options.nick);
  $("#options").append('<label id="showshortcuts" class="on" style="text-align: center; border-radius: 4px; color: white; cursor: pointer; padding: 0px 20px; width:100%">Show shortcuts</label>');
  $("body").append('<div id="shortcuts" style="display:none;z-index:999;width: 260px; color: rgb(128, 88, 208); border-radius: 6px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; margin: 0px auto 100px; padding: 10px 14px; background-color: rgba(30, 38, 46,0.7);position:absolute;top:50px;left:6px;"><ul style="list-style-type:none;padding:0;"><li>[F] - switch drawing mode</li><li>[G] - change color of drawing</li><li>[H] - change size of drawing</li><li>[J] - crazy drawing</li><li>[E] - previous skin</li><li>[R] - next skin</li><li>[Q] - quit</li><li>[ESC] - respawn</li><li>[SHIFT] - accelerate</li><li>[1-6] - switching options</li></ul></div>');
  $("body").append('<div id="chat" style="display:none;z-index:999; width: 260px; height: 270px; color: rgb(128, 88, 208); border-radius: 6px; font-family: \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif; font-size: 14px; padding: 10px 14px; background-color: rgba(30, 38, 46,0.7);position:absolute;bottom:110px;left:6px;"><div id="chatMessages" style="height:200px"></div><div id="yourMessage_holder" class="taho" style="width: 100%; height: 35px; margin-top: 10px; box-shadow: rgb(0, 0, 0) 0px 6px 50px; opacity: 1; background: rgb(76, 68, 124);"><input class="sumsginp" id="yourMessage" placeholder="Press [ENTER] to chat" style="width: 100%; top: 0px; outline: 0; height: 35px; padding: 10px; left:0; border-radius:6px;font-size:14px" /></div></div>');

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
      $("iframe").attr ('src', 'http://mods.slithersessions.com/social.html');
      $("#shortcuts").hide();
      options['showshortcuts'] = false;
    }
  });

  $('body').append('<div id="ss-fps-box">FPS: <span id="fps">waiting...</span></div>');
}

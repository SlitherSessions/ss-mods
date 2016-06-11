var ssKeyboard = {
  name: 'Keyboard',
  slug: 'keyboard',
  enabled: true,

  init: function() {
    $(document).keydown (function (e) {
      switch (e.keyCode) {
        case 27: // escape: respawn
          if (typeof window.bso != 'undefined') {
            forcing = true;
            connect();
          }
          break;

        case 9: // tab: toggle ip/fps box
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

        case 81: // q: exit game
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

        case 16: // shift, accelerate
          setAcceleration (true);
          break;

        default:
          break;
      }
    });

    $(document).keyup (function (e) {
      switch (e.keyCode) {
        case 16:
          setAcceleration (false);
          break;
      }
    });
  }
};

ss.register (ssKeyboard);

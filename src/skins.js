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

ss.register ((function() {
  var impl = {
    /** Reference slither's max skin number */
    superMaxSkinCv: window.max_skin_cv,

    /** Reference slither's original setSkin */
    superSetSkin: window.setSkin,

    /** Canvas used for drawing the antenna */
    bulb: null,

    /** Setup extra skins and override native setSkin */
    setupSkins: function() {
      if (skins.extras.length > 0)
        return;

      skins.add ({ rbcs: [ 9, 9, 9, 13, 13, 13 ] })     // green/white
           .add ({ rbcs: [ 9, 9, 9, 11, 11, 11 ] })     // black/white
           .add ({ rbcs: [ 0, 0, 0, 8, 8, 8 ] })        // striped purple
           .add ({ rbcs: [ 11 ] })                      // black
           .add ({ rbcs: [ 11, 9, 11, 7, 7, 7 ] })      // spyke gaming
           .add ({ rbcs: [ 5, 5, 5, 11, 11, 11 ]})      // orange/black
           .add ({ rbcs: [ 12, 12, 12, 11, 11, 11 ] }); // gold/black

      /** Get the image source for the antenna. TODO: make part of skin
          registration */
      function bulbSrcForSkin (skinId) {
        if (skinId == 48)
          return ss.resources.images.spykeLogo;
        else if (skinId == 49)
          return ss.resources.images.hazardLogo;

        return false;
      }

      /** Configure the antenna. TODO: make part of skin registration */
      function configureAntenna (snk, skinId) {
        if (skinId == 48) {
          // spyke
          snk.bsc  = .30;  // bulb scale
          snk.blba = 1.0;  // bulb alpha
          snk.blbx = -16;  // bulb x
          snk.blby = -70;  // bulb y
        }

        if (skinId == 49) {
          snk.atc1 = "#800";
          snk.atc2 = "#600";
        }
      }

      /** Adds an antennea to a snake */
      function addAntenna (snk, skinId) {
        if (impl.bulb == null) {
          impl.bulb = document.createElement('canvas');
          impl.bulb.style.display = false;
        }

        if (snk.bulb == null || typeof snk.bulb == 'undefined')
          snk.bulb = impl.bulb;

        {
          // Add the bulb image. scoped to avoid memory leak.
          var img = new Image();
          img.src = bulbSrcForSkin (skinId);
          snk.bulb.width  = parseInt (img.width);
          snk.bulb.height = parseInt (img.height);
          var ctx = snk.bulb.getContext ('2d');
          ctx.drawImage (img, 0, 0, img.width, img.height,
                              0, 0, img.width, img.height);
          img = null;
        }

        snk.atax = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        snk.atay = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        snk.atvx = [0, -2.174018144607544, -1.9938501119613647, -2.2244787216186523, -2.1016628742218018, -2.0143206119537354, -2.095236301422119, -2.2232143878936768, -1.9363921880722046];
        snk.atvy = [0, -0.7573261260986328, -0.7961844801902771, -0.3080170750617981, 0.2950030565261841, 0.8237428069114685, 0.568598210811615, 0.027775723487138748, -0.6246974468231201];
        snk.atx  = [10792, 10788.1982421875, 10784.205078125, 10780.369140625, 10776.814453125, 10773.0830078125, 10769.091796875, 10765.2275390625, 10761.48046875];
        snk.aty  = [10800, 10799.658203125, 10798.2373046875, 10796.662109375, 10795.90625, 10796.720703125, 10798.310546875, 10799.6298828125, 10799.82421875];

        snk.atba = 0.0; // not sure what this is
        snk.atia = 1.0; // antenna alhpa
        snk.atc1 = "#800";
        snk.atc2 = "#b00";

        snk.atwg = true;

        snk.bsc  = .25;  // bulb scale
        snk.blba = 1.0;  // bulb alpha
        snk.blbw = snk.bulb.width;   // bulb width
        snk.blbh = snk.bulb.height;  // bulb height
        snk.blbx = -1 * (snk.bulb.width / 2);  // bulb x
        snk.blby = -1 * (snk.bulb.height / 2);  // bulb y

        configureAntenna (snk, skinId);

        snk.abrot = true;
        snk.antenna_shown = true;
        snk.antenna = true;
      };

      window.setSkin = function (snk, skinId) {
        var skinIdCopy = skinId,
            isOnSkinChooser = $('#psk').is(':visible');

        impl.resetAntenna (snk);
        impl.superSetSkin (snk, parseInt (skinId));

        if (skinId > impl.superMaxSkinCv) {
          var c;
          var checkSkinId = skinId - impl.superMaxSkinCv - 1;

          if (skins.extras[checkSkinId] !== undefined) {
            c = skins.extras[checkSkinId].rbcs;
          } else {
            skinId %= 9;
          }

          c && (skinId = c[0]);
          snk.rbcs = c;
          snk.cv = skinId;

          if (skinIdCopy == 48) {
            addAntenna (snk, parseInt (skinIdCopy));
          }
        }

        if (isOnSkinChooser) {
          skins.skin = skinIdCopy;
          ss.saveOption ('skinId', skins.skin);
        }
      };
    },

    loop: function() {
      skins.rotate();
      setTimeout (impl.loop, 1500);
    },

    resetAntenna: function (snk) {
      snk.bulb = null;
    }
  };

  var skins = {
    slug: 'skins',
    skin: 0,

    extras: [],

    init: function() {
      skins.skin = parseInt (ss.loadOption ('skinId', 0));
      if (! ss.isInt (skins.skin) || typeof skins.skin == 'undefined' || isNaN (skins.skin))
        skins.skin = 0;
      impl.setupSkins();
      impl.loop();
    },

    add: function (skin) {
      if (typeof skin.rbcs == 'undefined' || skin.rbcs == null || skin.rbcs.length <= 0)
        return skins;

      skins.extras.push (skin);
      window.max_skin_cv += 1
      return skins;
    },

    /** go to next skin if rotation is enabled */
    rotate: function() {
      haveSnake = (typeof window.ws != 'undefined' && !$('#psk').is(':visible') &&
            typeof window.snake != 'undefined' && window.snake != null);
      if (! haveSnake)
        return;

      if (ss.options.rotateSkins) {
        skins.next();
      } else if (window.snake.rcv != skins.skin) {
        setSkin (snake, skins.skin);
      }
    },

    /** go to the next skin */
    next: function() {
      if (typeof window.snake == 'undefined')
        return;

      skins.skin += 1;

      if (skins.skin > max_skin_cv)
        skins.skin = 0;

      setSkin (window.snake, skins.skin);
    },

    /** go to the previous skin */
    previous: function() {
      if (typeof window.snake == 'undefined')
        return;

      if (skins.skin <= 0)
        skins.skin = max_skin_cv;
      else
        skins.skin -= 1;
      setSkin (window.snake, skins.skin);
    }
  };

  return skins;
})());

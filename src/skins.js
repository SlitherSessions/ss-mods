/*
  skins.js - This file is part of Slither Sessions Mods

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
  /** returns a default value if none provided */
  var d = function (a, d) { return (a) ? a : d; }

  var impl = {
    /** Reference slither's max skin number */
    superMaxSkinCv: window.max_skin_cv,

    /** Reference slither's original setSkin */
    superSetSkin: window.setSkin,

    /** Canvas used for drawing the antenna */
    bulb: null,

    /** Adds an antennea to a snake */
    addAntenna: function (snk, skin) {
      if (impl.bulb == null) {
        impl.bulb = document.createElement('canvas');
        impl.bulb.style.display = false;
      }

      if (snk.bulb == null || typeof snk.bulb == 'undefined')
        snk.bulb = impl.bulb;

      if (skin.bulb && skin.bulb.image) {
        var img = new Image();
        img.src = skin.bulb.image
        snk.bulb.width  = parseInt (img.width);
        snk.bulb.height = parseInt (img.height);
        var ctx = snk.bulb.getContext ('2d');
        ctx.drawImage (img, 0, 0, img.width, img.height,
                            0, 0, img.width, img.height);
        img = null;
      }

      // these were copied from the JS console, not currently modifiable via code
      snk.atax = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      snk.atay = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      snk.atvx = [0, -2.174018144607544, -1.9938501119613647, -2.2244787216186523, -2.1016628742218018, -2.0143206119537354, -2.095236301422119, -2.2232143878936768, -1.9363921880722046];
      snk.atvy = [0, -0.7573261260986328, -0.7961844801902771, -0.3080170750617981, 0.2950030565261841, 0.8237428069114685, 0.568598210811615, 0.027775723487138748, -0.6246974468231201];
      snk.atx  = [10792, 10788.1982421875, 10784.205078125, 10780.369140625, 10776.814453125, 10773.0830078125, 10769.091796875, 10765.2275390625, 10761.48046875];
      snk.aty  = [10800, 10799.658203125, 10798.2373046875, 10796.662109375, 10795.90625, 10796.720703125, 10798.310546875, 10799.6298828125, 10799.82421875];

      snk.atba = 0.0; // not sure what this is
      snk.atia = d (skin.antenna.alpha, 1.0);
      snk.atc1 = d (skin.antenna.color1, "#800");
      snk.atc2 = d (skin.antenna.color2, "#b00");

      if (skin.bulb) {
        snk.bsc  = d (skin.bulb.scale, 0.25);
        snk.blba = d (skin.bulb.alpha, 1.0);
        snk.blbw = d (skin.bulb.width, snk.bulb.width);
        snk.blbh = d (skin.bulb.height, snk.bulb.height);
        snk.blbx = d (skin.bulb.x, -1 * (snk.bulb.width / 2));
        snk.blby = d (skin.bulb.y, -1 * (snk.bulb.width / 2));
      }

      snk.atwg = true;
      snk.abrot = true;
      snk.antenna_shown = true;
      snk.antenna = true;
    },

    /** Setup extra skins and override native setSkin */
    setupSkins: function() {
      if (skins.extras.length > 0)
        return;

      skins.add ({ rbcs: [ 9, 9, 9, 13, 13, 13 ] })     // green/white
           .add ({ rbcs: [ 9, 9, 9, 11, 11, 11 ] })     // black/white
           .add ({ rbcs: [ 0, 0, 0, 8, 8, 8 ] })        // striped purple
           .add ({ rbcs: [ 11 ] })                      // black
           .add ({ rbcs: [ 11, 9, 11, 7, 7, 7 ],        // spyke gaming
                   antenna: {
                     alpha: 1.0,
                     color1: "#800",
                     color2: "#B00"
                   },
                   bulb: {
                     image: ss.resources.images.spykeLogo,
                     scale: 0.30,
                     alpha: 1.0,
                     x: -16,
                     y: -70
                   }
                 })
           .add ({ rbcs: [ 5, 5, 5, 11, 11, 11 ]})      // orange/black
           .add ({ rbcs: [ 12, 12, 12, 11, 11, 11 ] }) // gold/black
           .add ({ rbcs: [6,6,6,6,12,12,12,12],  // thomas37847
             antenna: {
               alpha: 0.5,
               color1: "#9E706F",
               color2: "#F2A8A6"
             },
             bulb: {
               image: ss.resources.images.thomasLogo,
               scale: 0.5,
               alpha: 1.0,
               x: -16,
               y: -50
             }
           });

      window.setSkin = function (snk, skinId) {
        var skinIdCopy = parseInt (skinId),
            isOnSkinChooser = $('#psk').is(':visible');

        impl.resetAntenna (snk);
        impl.superSetSkin (snk, parseInt (skinId));

        if (skinId > impl.superMaxSkinCv) {
          var c;
          var skin = skins.get (parseInt (skinId));
          if (skin !== null) {
            c = skin.rbcs;
          } else {
            skinId %= 9;
          }

          c && (skinId = c[0]);
          snk.rbcs = c;
          snk.cv = skinId;

          if (skin && (skin.antenna || skin.bulb))
            impl.addAntenna (snk, skin);
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

    /** adds an additional skin after stock skins */
    add: function (skin) {
      if (typeof skin.rbcs == 'undefined' || skin.rbcs == null || skin.rbcs.length <= 0)
        return skins;

      skins.extras.push (skin);
      window.max_skin_cv += 1
      return skins;
    },

    /** gets an extra skin */
    get: function (skinId) {
      if (skinId <= impl.superMaxSkinCv || skinId > max_skin_cv)
        return null;

      return skins.extras [skinId - impl.superMaxSkinCv - 1];
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

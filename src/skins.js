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
        img.onload = function() {
          snk.bulb.width  = parseInt (img.width);
          snk.bulb.height = parseInt (img.height);
          var ctx = snk.bulb.getContext ('2d');
          ctx.drawImage (img, 0, 0, img.width, img.height,
                              0, 0, img.width, img.height);
          img = null;

          // these were copied from the JS console, not currently modifiable via code
          snk.atax = [0, 0, 0, 0 ] //, 0, 0, 0, 0, 0];
          snk.atay = [0, 0, 0, 0 ] //, 0, 0, 0, 0, 0];
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
            snk.blbw = d (skin.bulb.width,  snk.bulb.width);
            snk.blbh = d (skin.bulb.height, snk.bulb.height);
            snk.blbx = d (skin.bulb.x, -1 * (snk.bulb.width / 2));
            snk.blby = d (skin.bulb.y, -1 * (snk.bulb.width / 2));
          }

          snk.atwg = true;
          snk.abrot = true;
          snk.antenna_shown = true;
          snk.antenna = true;
          
        }; // end onload

        img.src = skin.bulb.image
      }
    },

    /** Setup extra skins and override native setSkin */
    setupSkins: function() {
      if (skins.extras.length > 0)
        return;

      skins.add ({ rbcs: [ 9, 9, 9, 13, 13, 13 ], stockSkinId: 3})              // green/white
           .add ({ rbcs: [ 9, 9, 9, 11, 11, 11 ], stockSkinId: 33})             // black/white
           .add ({ rbcs: [ 0, 0, 0, 8, 8, 8 ], stockSkinId: 8})                 // striped purple
           .add ({ rbcs: [ 11 ], stockSkinId: 25})                              // black
           .add ({ rbcs: [ 11, 9, 11, 7, 7, 7 ], stockSkinId: 7,                // spyke gaming
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
           .add ({ rbcs: [ 5, 5, 5, 11, 11, 11 ], stockSkinId: 20})      // orange/black
           .add ({ rbcs: [ 12, 12, 12, 11, 11, 11 ], stockSkinId: 33,  // SS
             antenna: {
               alpha: 1.0,
               color1: "#000000",
               color2: "#EDA407"
             },
             bulb: {
               image: ss.resources.images.ssLogo,
               scale: 0.3,
               alpha: 1.0,
               x: -12,
               y: -86
             }
           })
           .add ({ rbcs: [6,6,6,6,12,12,12,12], stockSkinId: 6,  // thomas37847
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
           })
           .add ({rbcs: [9,9,9,9,9,9,9,12,12,12,12,12,12,12], stockSkinId: 5})  //white/golden orange
           .add ({rbcs: [3,3,3,3,3,3,3,9,9,9,9,9,9,9], stockSkinId: 3})         //green/white
           .add ({rbcs: [9,9,9,9,9,9,9,3,3,3,3,3,3,3], stockSkinId: 3})         //white/green
           .add ({rbcs: [17,17,17,17,17,17,17,9,9,9,9,9,9,9], stockSkinId: 0})  //purple/white
           .add ({rbcs: [9,9,9,9,9,9,9,17,17,17,17,17,17,17], stockSkinId: 0})  //white/purple
           .add ({rbcs: [23,23,23,23,23,23,23,9,9,9,9,9,9,9], stockSkinId: 2})  //light blue/white
           .add ({rbcs: [9,9,9,9,9,9,9,23,23,23,23,23,23,23], stockSkinId: 2})  //white/light blue
           .add ({rbcs: [18,18,18,18,18,18,18,9,9,9,9,9,9,9], stockSkinId: 4})  //golden/white
           .add ({rbcs: [22,22,22,22,22,22,22,9,9,9,9,9,9,9], stockSkinId: 5})  //orange/white
           .add ({rbcs: [7,7,7,7,18,18,18,18], stockSkinId: 18})                //red/gold
           .add ({rbcs: [26,26,26,26,26,26,26,27,27,27,27,27,27,27], stockSkinId: 12}) //jelly green/red
           .add ({rbcs: [27,27,27,27,27,27,27,26,26,26,26,26,26,26], stockSkinId: 12}) //jelly red/green
           //.add ({rbcs: [18,18,12,5,22,5,12,18,18], stockSkinId: 4 }) //golden striped
           .add ({rbcs: [0,17], stockSkinId: 0})                                // purple striped
           .add ({rbcs: [11,11,13,13], stockSkinId: 27,                         // SlitherClips
              antenna: {
                alpha: 0.5,
                color1: "#252525",
                color2: "#646464"
              },
              bulb: {
                image: ss.resources.images.slitherClipsLogo,
                scale: 0.16,
                alpha: 1.0,
                x: -15,
                y: -146
              }
            })
            .add ({rbcs: [11,26,26,26], stockSkinId: 27,                        // Wired Gaming
              antenna: {
                alpha: 0.5,
                color1: "#252525",
                color2: "#646464"
              },
              bulb: {
                image: ss.resources.images.jokerHead,
                scale: 0.10,
                alpha: 1.0,
                x: -18,
                y: -320
              }
            })
            .add ({ rbcs: [29,29,11,31,11], stockSkinId: 54 })                  // Red TT Sleek
            .add ({ rbcs: [29,29,11,34,11], stockSkinId: 8 })                   // Pink TT Sleek
            .add ({ rbcs: [29,29,11,34,11], stockSkinId: 8,                     // Cyristal Playz (kawaii)
              antenna: {
                alpha: 0.5,
                color1: "#252525",
                color2: "#646464"
              },
              bulb: {
                image: ss.resources.images.kawaii,
                scale: 0.20,
                alpha: 1.0,
                x: -80,
                y: -108
              }
            })
            .add ({ rbcs: [33,33,33,29,29,29 ], stockSkinId: 56 })              // Glowey Orange/Black
            .add ({ rbcs: [33,33,33,32,32,32 ], stockSkinId: 55 })              // Glowey Orange/Yellow
            .add ({ rbcs: [35,35,35,35,35,35,35, 33,33,33,33,33,33,33],         // Glowey Orange/Green
                    stockSkinId: 56 })
            .add ({ rbcs: [33,33,33,33,33,33,33, 35,35,35,35,35,35,35],         // Glowey Green/Orange
                    stockSkinId: 58 })
            .add ({ rbcs: [ 29, 29, 11, 29, 11], stockSkinId: 44})              // The Worminator
            .add ({ rbcs: [ 29,29,29,29,29, 31,31,31,31,31, 32,32,32,32,32 ],   // Glowey Black/Red/Yellow Stripe
                    stockSkinId: 11 })
            .add ({ rbcs: [ 11,11,11,11,11, 9,9,9,9,9,  18,18,18,18,18],        // YonduBR
                    stockSkinId: 4,
                    antenna: {
                      alpha: 0.5,
                      color1: "#252525",
                      color2: "#646464"
                    },
                    bulb: {
                      image: ss.resources.images.yondubr,
                      scale: 0.13,
                      alpha: 1.0,
                      x: -90,
                      y: -140
                    }
                  })
            .add ({ rbcs: [ 29,29,29,29, 32,32,32,32,32,32 ], stockSkinId: 55 })// Killer Bee
            .add ({ rbcs: [ 31, 31, 31, 7, 29, 7 ], stockSkinId: 54,            // FNAF Foxy, Arianna
                    antenna: {
                      alpha: 0.5,
                      color1: "#e52525",
                      color2: "#c46464"
                    },
                    bulb: {
                      image: ss.resources.images.foxyHead,
                      scale: 0.135,
                      alpha: 1.0,
                      x: -90,
                      y: -160
                    }
                  })
            .add ({ rbcs: [ 7,7,7,7,7, 14,14,14, 7,7, 9, 7, 9, 7,7,7,7,7,7,7,   // King of Agario
                            14,14,14,14,14, 7,7,7, 14,14, 9, 14, 9,
                            14,14,14,14,14,14,14], stockSkinId: 55 })
            .add ({ rbcs: [4, 4, 4, 4, 4, 13, 13, 13, 13, 13, 9, 9, 9, 9, 9],
                    stockSkinId: 54,                              // MopeX
                    antenna: {
                      alpha: 0.5,
                      color1: "#252525",
                      color2: "#646464"
                    },
                    bulb: {
                      image: ss.resources.images.mopeXLogo,
                      scale: 0.72,
                      alpha: 1.0,
                      x: -25,
                      y: -20
                    }
                  })
            .add ({ rbcs: [ 33, 33, 33, 12 ],
                    stockSkinId: 4,                              // Teddy Bear
                    antenna: {
                      alpha: 0.5,
                      color2: "#c78b31",
                      color1: "#966308"
                    },
                    bulb: {
                      image: ss.resources.images.teddyBear,
                      scale: 0.22,
                      alpha: 1.0,
                      x: -100,
                      y: -80
                    }
                  })
            .add ({ rbcs: [ 34,34,34,34, 11,11,11,11 ],
                    stockSkinId: 8,                              // Kitkat Angel
                    antenna: {
                      alpha: 0.5,
                      color2: "#f740ff",
                      color1: "#f740ff"
                    },
                    bulb: {
                      image: ss.resources.images.kitkatAngel,
                      scale: 0.70,
                      alpha: 1.0,
                      x: -46,
                      y: -56,
                      width: 100,
                      height: 100
                    }
                  });

      window.setSkin = function (snk, skinId) {
        skinId = parseInt (skinId);
        var isOnSkinChooser = $('#psk').is(':visible');

        if (isOnSkinChooser && typeof snk.rcv == 'undefined') {
          // Should be entering the skin chooser for the first time.
          skinId = skins.savedSkin;
        } else if (isOnSkinChooser) {
          // Probably scrolling though the skin chooser.
          skins.skin = skinId;
        }

        impl.resetAntenna (snk);
        impl.superSetSkin (snk, skinId);
        if (!isOnSkinChooser && window.snake !== snk) return; // Random snake on the board, let's leave it be.

        snk.SSkin = false;
        if (skinId > impl.superMaxSkinCv) {
          var c;
          var skin = skins.get (skinId);
          if (skin !== null) {
            c = skin.rbcs;
            snk.SSkin = true;
          } else {
            skinId %= 9;
          }

          c && (skinId = c[0]);
          snk.rbcs = c;
          snk.cv = skinId;

          if (skin && (skin.antenna || skin.bulb))
            impl.addAntenna (snk, skin);
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
    savedSkin: 0,

    extras: [],

    init: function() {
      skins.skin = parseInt (ss.loadOption ('skinId', 0));
      if (! ss.isInt (skins.skin) || typeof skins.skin == 'undefined' || isNaN (skins.skin))
        skins.skin = 0;

      skins.savedSkin = skins.skin;
      impl.setupSkins();
      impl.loop();
      skins.setStockSkin(skins.savedSkin);

      // Add event listener to Save button in the skin chooser.
      if (b = document.getElementsByClassName('sadg1')[1]) {
        b.addEventListener ('click', function() {
          ss.skins.savedSkin = ss.skins.skin;
          ss.saveOption ('skinId', ss.skins.savedSkin);
          window.snake.rcv = ss.skins.setStockSkin(ss.skins.savedSkin);
        }, false);
      }
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
      } else if ((skins.skin > impl.superMaxSkinCv && !snake.SSkin) || (skins.skin !== snake.rcv && !snake.SSkin)) {
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
    },

    /** Set the stock skin. This controls how the skin is visible to other players,
        and the dot color. */
    setStockSkin: function (skinId) {
      if (skinId < impl.superMaxSkinCv) {
        // not an extra skin, noop
        return skinId;
      }
      var stockSkinId = 0;
      var skin = skins.get(skinId)
      if (!skin || !(stockSkinId = skin.stockSkinId)) {
        ss.log ('setStockSkin: Failed to get skin\'s stockSkinId, or none has been \
                 defined. Stock skin remains ' + skinId + '.');
        return skinId;
      }
      localStorage.snakercv = stockSkinId;
      return stockSkinId;
    }
  };
  return skins;
})());

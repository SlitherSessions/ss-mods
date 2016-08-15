var ssSkins = {
  slug: 'skins',
  skin: 0,
  images: {
    spyke: 'data:image/png;base64,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'
  },
  bulb: null,

  init: function() {
    _mod = ssSkins;
    _mod.skin = 0; //ss.loadOption ('skinId', 0);

    setTimeout (_mod.addSkins, 1000);
  },

  addSkins: function() {
    _mod = ssSkins;
    setSkin = (function() {
      var
        superMaxSkinCv = max_skin_cv,
        superSetSkin = setSkin,
        newSkins = [
          [ 9, 9, 9, 13, 13, 13 ], // striped black and white
          [ 9, 9, 9, 11, 11, 11 ], // striped black and white
          [ 0, 0, 0, 8, 8, 8 ], // Striped purple I
          [ 11 ], // black
          [ 11, 11, 20, 20 ]
        ];
      max_skin_cv += newSkins.length;

      var addAntenna = function(snk) {
        if (_mod.bulb == null) {
          _mod.bulb = document.createElement('canvas');
          document.body.appendChild(_mod.bulb);
        }

        if (snk.bulb == null || typeof snk.bulb == 'undefined')
          snk.bulb = _mod.bulb;

        snk.bulb.width = 69;
        snk.bulb.height = 139;

        {
          var img = new Image();
          img.src = _mod.images.spyke;
          var ctx = snk.bulb.getContext('2d');
          ctx.drawImage(img, 0, 0, 69, 139,
                             0, 0, 69, 139);
          img = null;
        }

        // snk.atax = [ 0, 0, 0, 0, 0, 0, 0, 0 , 0];
        // snk.atay = [ 0, 0, 0, 0, 0, 0, 0, 0 , 0];
        // snk.atba = 3.1081141212566976;
        snk.atc1 = "#cccccc";
        snk.atc2 = "#777777";

        // snk.atia = 43.0;

        snk.atvx = []; //[0, -2.103635549545288, -2.1709976196289062, -2.1238646507263184, -2.1208152770996094, -2.1313042640686035, -2.0891921520233154, -2.1627938747406006, -2.2419145107269287];
        snk.atvy = []; //[0, -0.6077767014503479, 0.010835126042366028, 0.6022540330886841, 0.823241651058197, 0.376800537109375, -0.35352665185928345, -0.8161353468894958, -0.6436467170715332];

        snk.atx = []; [8184, 8180.19091796875, 8176.392578125, 8172.3974609375, 8168.59130859375, 8165.02099609375, 8161.29248046875, 8157.3017578125, 8153.4375];
        snk.aty = []; [8192, 8191.6962890625, 8190.28759765625, 8188.75732421875, 8188.03857421875, 8188.8154296875, 8190.4189453125, 8191.76171875, 8191.91259765625];


        snk.atwg = true;
        snk.antenna_shown = true;
        snk.antenna = true;
      };

      return function (snk, skinId) {
        var skinIdCopy = skinId;
        var isOnSkinChooser = $('#psk').is(':visible');

        if (skinId > superMaxSkinCv) {
          superSetSkin (snk, skinIdCopy);

          var c;
          var checkSkinId = skinId - superMaxSkinCv - 1;

          if (newSkins[checkSkinId] !== undefined) {
            c = newSkins[checkSkinId];
          } else {
            skinId %= 9;
          }

          c && (skinId = c[0]);
          snk.rbcs = c;
          snk.cv = skinId;

          if (skinIdCopy == 48) /* Spyke's skin */
            addAntenna(snk);

        } else {
          superSetSkin (snk, skinId);
        }

        if (isOnSkinChooser) {
          _mod.skin = skinIdCopy;
          ss.saveOption ('skinId', _mod.skin);
          console.log('skin: ' + _mod.skin);
        }
      };
    })();

    _mod.loop();
  },

  rotate: function() {
    _mod = ssSkins;
    haveSnake = (typeof window.ws != 'undefined' && !$('#psk').is(':visible') &&
          typeof window.snake != 'undefined' && window.snake != null);
    if (! haveSnake)
      return;

    if (ss.options.rotateSkins) {
      _mod.next();
    } else if (window.snake.cv != _mod.skin) {
      setSkin (snake, _mod.skin);
    }
  },

  next: function() {
    if (typeof window.snake == 'undefined')
      return;

    _mod = ssSkins;
    _mod.skin += 1;

    if (_mod.skin > max_skin_cv)
      _mod.skin = 0;

    setSkin (window.snake, _mod.skin);
  },

  previous: function() {
    if (typeof window.snake == 'undefined')
      return;

    _mod = ssSkins;
    if (_mod.skin <= 0)
      _mod.skin = max_skin_cv;

    _mod.skin -= 1;
    setSkin (window.snake, _mod.skin);
  },

  loop: function() {
    _mod = ssSkins;
    _mod.rotate();
    setTimeout (_mod.loop, 1500);
  }
};

ss.register (ssSkins);

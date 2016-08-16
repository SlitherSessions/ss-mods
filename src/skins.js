'use strict'

ss.register ((function() {
  var skins = {
    useAntennas: true,
    slug: 'skins',
    skin: 0,
    images: {
      spyke: 'data:image/png;base64,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'
    },
    bulb: null,

    init: function() {
      _mod = this;
      _mod.skin = parseInt (ss.loadOption ('skinId', 0));
      if (! ss.isInt (_mod.skin) || typeof _mod.skin == 'undefined' || isNaN (_mod.skin))
        _mod.skin = 0;
      setTimeout (_mod.addSkins, 1000);
    },

    addSkins: function() {
      setSkin = (function() {
        var
          superMaxSkinCv = max_skin_cv,
          superSetSkin = setSkin,
          newSkins = [
            [ 9, 9, 9, 13, 13, 13 ], // striped green and white
            [ 9, 9, 9, 11, 11, 11 ], // striped black and white
            [ 0, 0, 0, 8, 8, 8 ],    // Striped purple I
            [ 11 ],                  // black
            [ 11, 9, 11, 7, 7, 7 ]   // Spyke Entertainment
          ];
        max_skin_cv += newSkins.length;

        var resetAntenna = function (snk) {
          snk.bulb = null;
        };

        var addAntenna = function (snk) {
          if (_mod.bulb == null) {
            _mod.bulb = document.createElement('canvas');
          }

          _mod.bulb.style.display = false;

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

          snk.bsc  = .30;  // bulb scale
          snk.blba = 1.0;  // bulb alpha
          snk.blbx = -16;  // bulb x
          snk.blby = -70;  // bulb y
          snk.blbw = 69;   // bulb width
          snk.blbh = 139;  // bulb height

          snk.abrot = true;
          snk.antenna_shown = true;
          snk.antenna = true;
        };

        return function (snk, skinId) {
          var skinIdCopy = skinId;
          var isOnSkinChooser = $('#psk').is(':visible');

          if (skinId > superMaxSkinCv)
            resetAntenna (snk);

          superSetSkin (snk, skinId);
          if (skinId > superMaxSkinCv) {
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

            if (_mod.useAntennas && skinIdCopy == 48) /* Spyke's skin */
              addAntenna(snk);

          }

          if (isOnSkinChooser) {
            _mod.skin = skinIdCopy;
            ss.saveOption ('skinId', _mod.skin);
          }
        };
      })();

      skins.loop();
    },

    rotate: function() {
      _mod = this;
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

      _mod = this;
      _mod.skin += 1;

      if (_mod.skin > max_skin_cv)
        _mod.skin = 0;

      setSkin (window.snake, _mod.skin);
    },

    previous: function() {
      if (typeof window.snake == 'undefined')
        return;

      _mod = this;
      if (_mod.skin <= 0)
        _mod.skin = max_skin_cv;

      _mod.skin -= 1;
      setSkin (window.snake, _mod.skin);
    },

    loop: function() {
      skins.rotate();
      setTimeout (skins.loop, 1500);
    }
  };

  return skins;
})());

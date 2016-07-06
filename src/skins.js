var ssSkins = {
  slug: 'skins',
  skin: 0,

  init: function() {
    _mod = ssSkins;
    _mod.skin = ss.loadOption ('skinId', 0);
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
          [ 11 ] // black
        ];
      max_skin_cv += newSkins.length;

      return function (snk, skinId) {
        var skinIdCopy = skinId;
        var isOnSkinChooser = $('#psk').is(':visible');
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
        }

        if (isOnSkinChooser) {
          _mod.skin = skinIdCopy;
          ss.saveOption ('skinId', _mod.skin);
        }
      };
    })();

    _mod.loop();
  },

  rotate: function() {
    _mod = ssSkins;
    if (! ss.options.rotateSkins)
      return;

    if (typeof window.ws != 'undefined' &&
          !$('#psk').is(':visible') &&
          typeof window.snake != 'undefined' &&
          window.snake != null)
    {
      _mod.next();
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

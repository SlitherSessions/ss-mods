var ssSkins = {
  slug: 'skins',
  enabled: false,
  skin: 0,

  init: function() {
    _mod = ssSkins;
    setTimeout (_mod.addSkins, 1000);
  },

  addSkins: function() {
    setSkin = (function() {
      var
        superMaxSkinCv = max_skin_cv,
        superSetSkin = setSkin,
        newSkins = [];
      max_skin_cv += newSkins.length;

      return function (snake, skinId) {
        superSetSkin (snake, skinId);
        if (skinId > superMaxSkinCv) {
          var c,
            checkSkinId = skinId - superMaxSkinCv - 1;
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
  },

  rotate: function() {
    _mod = ssSkins;
    if (! _mod.enabled)
      return;

    if (! ss.isInt (_mod.skin))
      _mod.skin = 0;

    if (typeof window.ws != 'undefined' &&
          !$('#psk').is(':visible') &&
          typeof window.snake != 'undefined' &&
          window.snake != null)
    {
      setSkin (window.snake, _mod.skin++);
    }

    if (_mod.skin >= ss.numSkins())
      _mod.skin = 0;
  },

  loop: function () {
    _mod = ssSkins;
    _mod.rotate();
  }
};

ss.register (ssSkins);

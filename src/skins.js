var ssSkins = {
  slug: 'skins',
  skin: 0,

  init: function() {
    _mod = ssSkins;
    setTimeout (_mod.addSkins, 1000);
  },

  addSkins: function() {
    _mod = ssSkins;
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

    _mod.loop();
  },

  rotate: function() {
    _mod = ssSkins;
    if (! ss.options.rotateSkins)
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

    if (_mod.skin >= max_skin_cv)
      _mod.skin = 0;
  },

  next: function() {
    if (typeof window.snake == 'undefined')
      return;

    _mod = ssSkins;
    _mod.skin += 1;

    if (_mod.skin >= max_skin_cv)
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

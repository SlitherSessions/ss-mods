var ssSkinRotator = {
  enabled: false,
  skin: 0,

  rotate: function() {
    _mod = ssSkinRotator;
    if (! _mod.enabled)
      return;

    if (! ss.isInt (_mod.skin))
      _mod.skin = 0;

    if (typeof window.ws != "undefined" &&
          !$('#psk').is(':visible') &&
          typeof window.snake != "undefined" &&
          window.snake != null)
    {
      setSkin (window.snake, _mod.skin++);
    }

    if (_mod.skin >= ss.numSkins())
      _mod.skin = 0;
  },

  loop: function () {
    _mod = ssSkinRotator;
    _mod.rotate();
  }
};

ss.register (ssSkinRotator);

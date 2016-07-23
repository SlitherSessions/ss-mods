
// SS main
$(function() {
  // ss.options.useLastHost = ss.loadOption ('useLastHost', false);

  // IP Connect Button
  $('body').append (
    '<div id="ss-ip-box"> \
      <label onclick="ss.connectToHost()" id="ss-ip-connect" \
             class="on">Connect to IP</label> \
      </div>');

  $('#playh .btnt.nsi.sadg1').click (function (e) {
    if (ss.options.useLastHost)
      ss.forceLastHost();

    ss.waitForSnake (function (s) {
      setSkin (s, ss.skins.skin);
    });
  });

  $('#tag').val (ss.loadOption ('savedClan', '[SS]'));
});

ss.mods.forEach (function (mod, i, a) {
  if (typeof mod.init != 'undefined')
    mod.init();
});


// SS main
$(function() {
  // IP Connect Button
  $('body').append (
    '<div id="ss-ip-box"> \
      <label onclick="ss.connectToHost()" id="ss-ip-connect" \
             class="on">Connect to IP</label> \
      </div>');

  $('#playh .btnt.nsi.sadg1').click (function() {
    function delayedPlay() {

      if (window.snake && ss.skins.skin != window.snake.rcv) {
        setSkin (window.snake, ss.skins.skin);
      }
    };
    setTimeout (delayedPlay, 300);
  });

  $('#tag').val (ss.loadOption ('savedClan', '[SS]'));
});

ss.mods.forEach (function (mod, i, a) {
  if (typeof mod.init != 'undefined')
    mod.init();
});

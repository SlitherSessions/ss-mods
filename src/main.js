
// SS main
$(function() {
  // IP Connect Button
  $('body').append (
    '<div id="ss-ip-box"> \
      <label onclick="ss.connectToHost()" id="ss-ip-connect" \
             class="on">Connect to IP</label> \
      </div>');

  $('#playh .btnt.nsi.sadg1').click (function() {
    // noop
  });

  $('#tag').val (userInterface.loadPreference ('savedClan', null));
});

ss.mods.forEach (function (mod, i, a) {
  if (typeof mod.init != 'undefined')
    mod.init();
});

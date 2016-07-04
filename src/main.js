function asciize (b, typing) {
  var h, c, f;
  c = b.length;
  var w = !1;
  for (h = 0; h < c; h++)
    if (f = b.charCodeAt(h), 32 > f || 127 < f) {
      w = !0;
      break
    }
  if (w) {
    w = "";
    for (h = 0; h < c; h++) f = b.charCodeAt(h), w = 32 > f || 127 < f ? w + " " : w + String.fromCharCode(f);
    return w
  }

  if (! typing) {
    window.options.nick = $("#nick").val();
    window.options.clantag = $("#tag").val();
    localStorage['slitherSessions'] = JSON.stringify (window.options);
  }

  return ss.clanTags.length > 0 && !typing ? jQuery("#tag").val() + ' ' + b : b;
}

function addClanTags() {
  window.nick.oninput = function() {
    var b = this.value;
    var h = asciize (b, true);
    24 < h.length && (h = h.substr (0, 24));
    b != h && (this.value = h);
  };

  $('.taho').before (
    '<div id="ss-tag-holder" class="taho"><select class="sumsginp" id="tag"></select></div>'
  );

  $('#tag').change(function () {
      ss.saveOption ('savedClan', $(this).val());
  });

  $('#tag').append("<option value=''>---</option>");
  for (var i = 0; i < ss.clanTags.length; ++i) {
    var tag = ss.clanTags [i];
    $("#tag").append("<option value='[" + tag + "]'>[" + tag + "]</option>");
  }
}

addClanTags();

// SS main
$(function() {
  // IP Connect Button
  $('body').append (
    '<div id="ss-ip-box"> \
      <label onclick="ss.connectToHost()" id="ss-ip-connect" \
             class="on">Connect to IP</label> \
      </div>');

  $('#playh .btnt.nsi.sadg1').click (function() {
    setTimeout (function() {
      if ((!ws || ws.readyState != ws.OPEN) && window.bso.ip == ss.currentIp()) {
        alert ('Server is full! Looking for a new server...');
        document.location.href = 'http://slither.io/';
      }
    }, 6000);
  });

  $('#tag').val (userInterface.loadPreference ('savedClan', null));
});

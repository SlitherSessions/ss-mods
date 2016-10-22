/*
  clans.js - This file is part of Slither Sessions Mods

  The MIT License (MIT)
  Copyright (c) 2016 Slither Sessions.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
var ssClanTags = [ 'SS', 'JG', 'YT' ];

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

  var s = (c < 20) ? ' ' : '';
  var clanPrefix = ($('#tag').val().length > 0) ? $("#tag").val() + s : '' ;
  return ssClanTags.length > 0 && !typing ? clanPrefix + b : b;
}

function ssAddClanTags() {
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
  for (var i = 0; i < ssClanTags.length; ++i) {
    var tag = ssClanTags [i];
    $("#tag").append("<option value='[" + tag + "]'>[" + tag + "]</option>");
  }
}

ssAddClanTags();

/*
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

// bot ui extensions and overrides
userInterface.superOnFrameUpdate = userInterface.onFrameUpdate;
userInterface.onFrameUpdate = function() {
  userInterface.superOnFrameUpdate();
  if (typeof window.ss != 'undefined')
    window.ss.onFrameUpdate();
};

userInterface.superOefTimer = userInterface.oefTimer;
userInterface.oefTimer = function() {
  userInterface.superOefTimer();
  if (! window.playing)
    canvas.resetZoom();
}

userInterface.removeLogo = function() {
  if (typeof window.showlogo_iv !== 'undefined') {
    window.ncka = window.lgss = window.lga = 1;
    clearInterval(window.showlogo_iv);
    showLogo(true);
  }
};

userInterface.toggleOverlays = function() {
  Object.keys(userInterface.overlays).forEach (function (okey) {
    var isIpBox = userInterface.overlays[okey].id == 'ss-server-overlay';
    if (! isIpBox) {
      var oVis = userInterface.overlays[okey].style.visibility !== 'hidden'
        ? 'hidden' : 'visible';
      userInterface.overlays[okey].style.visibility = oVis;
    }
  });
};

userInterface.ssOnKeyDown = function (e) {
  userInterface.onkeydown (e);

  if (! window.playing)
    return;

  // Letter 'L' to rotate skins
  if (e.keyCode === 76) {
      ss.options.rotateSkins = !ss.options.rotateSkins;
      userInterface.savePreference ('rotateSkins', ss.options.rotateSkins);
  }
  // Letter 'K' next skin
  if (e.keyCode === 75) {
      ss.skins.next();
  }
  // Letter 'J' previous skin
  if (e.keyCode === 74) {
      ss.skins.previous();
  }
  // Letter 'P' toggle static host
  if (e.keyCode === 80) {
      ss.options.useLastHost = !ss.options.useLastHost;
      // ss.saveOption ('useLastHost', ss.options.useLastHost);
  }
  // Key ']' toggle IP visibility
  if (e.keyCode === 221) {
      var serverOverlay = document.getElementById('ss-server-overlay');
      var oVis = serverOverlay.style.visibility !== 'hidden' ? 'hidden' : 'visible';
      serverOverlay.style.visibility = oVis;
  }

  userInterface.onPrefChange();
};

userInterface.onPrefChange = function () {
  // Set static display options here.
  var oContent = [];
  var ht = userInterface.handleTextColor;

  oContent.push('version: ' + window.ss.version());
  oContent.push('[T / Right click] bot: ' + ht(bot.isBotEnabled));
  oContent.push('[O] mobile rendering: ' + ht(window.mobileRender));
  oContent.push('[A/S] radius multiplier: ' + bot.opt.radiusMult);
  // oContent.push('[D] quick radius change ' +
  //     bot.opt.radiusApproachSize + '/' + bot.opt.radiusAvoidSize);
  oContent.push('[I] auto respawn: ' + ht(window.autoRespawn));
  oContent.push('[G] leaderboard overlay: ' + ht(window.leaderboard));
  oContent.push('[Y] visual debugging: ' + ht(window.visualDebugging));
  oContent.push('[U] log debugging: ' + ht(window.logDebugging));
  oContent.push('[H] overlays');
  oContent.push('[B] change background');
  oContent.push('[Mouse Wheel] zoom');
  oContent.push('[Z] reset zoom');
  oContent.push('[L] rotate skins: ' + ht(ss.options.rotateSkins));
  oContent.push('[K] next skin');
  oContent.push('[J] previous skin');
  oContent.push('[P] use static host: ' + ht(ss.options.useLastHost));
  oContent.push('[ESC] quick respawn');
  oContent.push('[Q] quit to menu');

  userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
},

// Main
(function (window, document) {
  window.play_btn.btnf.addEventListener ('click', userInterface.playButtonClickListener);
  document.onkeydown = userInterface.ssOnKeyDown;
  window.onmousedown = userInterface.onmousedown;
  window.addEventListener ('mouseup', userInterface.onmouseup);

  // tweak bot Defaults
  bot.isBotEnabled = false;
  bot.opt.followCircleLength = 8000;
  bot.opt.targetFps = 30;

  // Hide top score
  userInterface.hideTop();

  // force server
  userInterface.initServerIp();
  userInterface.server.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      window.play_btn.btnf.click();
    }
  });

  // Overlays
  userInterface.initOverlays();
  userInterface.overlays.serverOverlay.id = "ss-server-overlay";
  userInterface.overlays.serverOverlay.style.position = 'fixed';
  userInterface.overlays.serverOverlay.style.left = '140px';
  userInterface.overlays.serverOverlay.style.bottom = '10px';
  userInterface.overlays.serverOverlay.style.width = '400px';
  userInterface.overlays.serverOverlay.style.height = '42px';
  userInterface.overlays.serverOverlay.style.color = '#C0C0C0';
  userInterface.overlays.serverOverlay.style.fontFamily = 'Consolas, Verdana';
  userInterface.overlays.serverOverlay.style.zIndex = 999;
  userInterface.overlays.serverOverlay.style.fontSize = '42px';
  userInterface.overlays.serverOverlay.style.overflow = 'visible';
  userInterface.overlays.serverOverlay.className = 'nsi';

  userInterface.overlays.statsOverlay.style.top = '390px';

  // Load preferences
  ss.loadOption ('logDebugging', false);
  ss.loadOption ('visualDebugging', false);
  ss.loadOption ('autoRespawn', true);
  ss.loadOption ('mobileRender', false);
  ss.options.rotateSkins = ss.loadOption ('rotateSkins', false);
  window.nick.value = ss.loadOption ('savedNick', 'Robot');

  // Listener for mouse wheel scroll - used for setZoom function
  document.body.addEventListener ('mousewheel', canvas.setZoom);
  document.body.addEventListener ('DOMMouseScroll', canvas.setZoom);

  // Set render mode
  if (window.mobileRender)
    userInterface.toggleMobileRendering (true);

  // Unblocks all skins without the need for FB sharing.
  window.localStorage.setItem ('edttsg', '1');

  // Remove social
  userInterface.removeLogo();
  window.social.remove();

  // Maintain fps
  setInterval (userInterface.framesPerSecond.fpsTimer, 80);

  // Start!
  userInterface.oefTimer();
})(window, document);

// SS jQuery main
$(function() {
  $('#playh .btnt.nsi.sadg1').click (function (e) {
    if (ss.options.useLastHost) {
      ss.forceLastHost();
    }

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

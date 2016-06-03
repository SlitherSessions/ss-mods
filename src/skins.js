function addSkins() {
  setSkin = (function() {
    var
      // Get amount of original skins.
      originalMaxSkinCv = max_skin_cv,
      // Save original setSkin function.
      originalSetSkin = setSkin,
      // Array with new skins.
      newSkins = [
        [11, 7, 7, 11, 11, 11, 9, 9],
        [4, 3, 3, 4, 4, 4],
        [5, 5, 7, 5, 22, 22, 4, 4, 22, 22, 5, 5, 9, 9],
        [16, 16, 16, 16, 7, 7, 7, 9, 9, 10, 10, 10, 9, 9, 7, 7, 7],
        [12, 7, 7, 7, 7, 9, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        [11, 9, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
        [16, 16, 7, 7, 7, 7, 9, 11, 7, 7, 7, 7, 16],
        [3, 3, 3, 9, 11, 9],
        [11,11,18,18], // dordmund (grey yellow)
        [21,21,7,7], // bayermunih (red blue)
        [11,11,7,7], // milan (red grey)
        [11,11,1,1], // inter (red grey)
        [11,11,9,9], // besiktas (white black)
        [18,18,21,21], // fenerbahce (blue yellow)
        [18,18,7,7], // galatasaray (red yellow)
        [21,21,1,1], // mancity (blue lowblue)
        [21,21,8,8], // barcelona (red blue)
        [21,21,21,9,7,9], // paris saint germain (red blue)
        [11, 9, 11, 7, 7, 7], // Mexican Kingsnake
        [11, 9, 11, 4, 4, 4], // Mexican Kingsnake
        [11, 9, 11, 5, 5, 5], // Mexican Kingsnake
        [11, 9, 11, 23, 23, 23], // Mexican Kingsnake
        [12, 13, 14, 15, 16, 17, 18, 21, 22, 23], //Test 2
        [12, 11, 22, 22, 23, 23, 12], // Nice colors
        [11],
        [25],// fullcolor green
        [21] //full color blue
      ];
    max_skin_cv += newSkins.length;

    return function (snake, skinId) {
      originalSetSkin (snake, skinId);
      if (skinId > originalMaxSkinCv) {
        var c,
          checkSkinId = skinId - originalMaxSkinCv - 1;
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
}

function skinRotator(i) {
  if (! isInt (i))
    i = 0;

  if (typeof ws != "undefined" && options.skinrotator && !$('#psk').is(':visible') && typeof snake != "undefined" && snake != null) {
    setSkin (snake, i++);
  }

  if (i > (25 + 16)) i = 0;
  setTimeout(skinRotator, 1000, i);
}

setTimeout (addSkins, 1000);

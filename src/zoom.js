/** Zoom Support */
function ssZoomDisplay (e) {
  console.log("ZOOM");
  if (! window.gsc) {
    console.log("no GSC found");
    return;
  }

  options.zoom = true;
  if (! options.zoom) {
    window.gsc = 0.9;
    return;
  }

  console.log('gsc = ' + window.gsc);
  window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
  window.gsc > 2 ? window.gsc = 2 : window.gsc < 0.1 ? window.gsc = 0.1 : null;
}

if (/firefox/i.test(navigator.userAgent)) {
  document.addEventListener ('DOMMouseScroll', ssZoomDisplay, false);
} else if (/Safari/i.test(navigator.userAgent)){
  console.log("Zoom not support on Safari");
} else if (/Chrome/i.test(navigator.userAgent)) {
  document.body.onmousewheel = ssZoomDisplay;
} else {
  document.body.onmousewheel = ssZoomDisplay;
}

function zoom (e) {
  if (! window.gsc) {
    return;
  }

  console.log ('zoom: ' + window.gsc);
  if (! options.zoom) {
    window.gsc = 0.9;
    return;
  }

  window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
  window.gsc > 2 ? window.gsc = 2 : window.gsc < 0.1 ? window.gsc = 0.1 : null;
}

if (/firefox/i.test(navigator.userAgent)) {
  document.addEventListener("DOMMouseScroll", zoom, false);
} else {
  document.body.onmousewheel = zoom;
}

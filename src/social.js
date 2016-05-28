
var sdan = false; // social done animating
var sshfr = 0;
var social = document.getElementById ('social');
var ytfhol = document.getElementById ('ytfhol');
var fbfhol = document.getElementById ('fbfhol');
var twfhol = document.getElementById ('twfhol');

var cssoc = false;

var load_tm = Date.now();
var oef_iv = -1;

var ltm = Date.now();

function oef () {
 var ctm = Date.now();
 vfr = (ctm - ltm)/8;
 ltm = ctm;
 if (! cssoc) { // can show social
  if (social.offsetHeight > 66) { // ok
    cssoc = true;
    load_tm = Date.now(); // a lie, but keeps the loop alive til the animation is done
  } else if (ctm - load_tm > 6000) { // too long to load. just give up
    clearInterval(oef_iv);
  }
 } else if (!sdan) { //social done animating
  sshfr += vfr/203;
  var k = Math.pow(Math.min(1, Math.max(0, sshfr)), .5);
  if (ytfhol) {
   ytfhol.style.opacity = .8*k;//Math.sin(2.3 * k);
   //ytfhol.style.marginTop = (Math.round((9 - 9*k)*1000)/1000) + 'px';
  }
  var k = Math.pow(Math.min(1, Math.max(0, sshfr - .22)), .5);
  if (fbfhol) {
   fbfhol.style.opacity = .8*k;//Math.sin(2.3 * k);
   //fbfhol.style.marginTop = (Math.round((15 - 9*k)*1000)/1000) + 'px';
  }
  var k = Math.pow(Math.min(1, Math.max(0, sshfr - .44)), .5);
  if (twfhol) {
   twfhol.style.opacity = .8*k;//Math.sin(2.3 * k);
   //twfhol.style.marginTop = (Math.round((15 - 9*k)*1000)/1000) + 'px';
  }
  if (sshfr >= 1.44) {
   sdan = true;
   clearInterval(oef_iv);
  }
 }
}

oef_iv = setInterval('oef()', 25);

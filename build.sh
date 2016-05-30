#!/bin/bash

set -ex

yuicompressor -o mods/js/main.min.js src/main.js
yuicompressor -o mods/js/social.min.js src/social.js
yuicompressor -o mods/css/style.min.css mods/css/style.css

rm -f *.zip
zip -r slither-sessions-chrome.zip chrome

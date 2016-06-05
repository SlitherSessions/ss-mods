#!/bin/bash

set -ex

rm -rf ./build && mkdir -p build
cat src/ss.js src/skin_rotator.js src/main.js > build/main.js
yuicompressor -o mods/js/main.min.js build/main.js
# cat src/main.js > mods/js/main.min.js

yuicompressor -o mods/js/social.min.js src/social.js
yuicompressor -o mods/css/style.min.css mods/css/style.css

cat www/js/main.js www/js/plugins.js www/js/ga.js > www/js/app.js
yuicompressor -o www/js/app.min.js www/js/app.js
yuicompressor -o www/css/main.min.css www/css/main.css

rm -f *.zip
zip -r slither-sessions-chrome.zip chrome

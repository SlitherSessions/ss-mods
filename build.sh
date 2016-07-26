#!/bin/bash

set -ex

cat src/ss.js vendor/bot/bot.user.js src/skins.js src/clans.js \
  src/main.js > build/ss.js
yuicompressor -o build/ss.min.js build/ss.js
cat build/ss.min.js > mods/js/ss.min.js
cat build/ss.min.js > chrome/js/ss.min.js

mkdir -p chrome/css # in case the dir doesn't exist.
yuicompressor -o mods/css/style.min.css mods/css/style.css
cat mods/css/style.min.css > chrome/css/style.min.css

# Make the chrome extension upload package
rm -f *.zip
zip -rvT slither-sessions-chrome.zip chrome

#!/bin/bash

set -ex
yuicompressor -o js/main.min.js src/main.js
yuicompressor -o js/social.min.js src/social.js
yuicompressor -o css/style.min.css css/style.css

rm -f *.zip
zip -r slither-sessions-chrome.zip chrome

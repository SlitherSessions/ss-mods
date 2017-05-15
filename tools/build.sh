#!/bin/bash

# The MIT License (MIT)
# Copyright (c) 2016 Slither Sessions.  All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

set -ex

is_release="$1"

function minify_source() {
  if ! compressor_loc="$(type -p "yuicompressor")" || [ -z "$compressor_loc" ] || [ -z "$is_release" ]; then
    cat "$1" > "$2"
  else
    yuicompressor -o "$2" "$1"
  fi
}

mkdir -p build

# Splice out the bot code we care about
# awk 'NR >= 0 && NR < 2115' vendor/bot-ce/bot.user.js > src/gozer.js

cat src/config.js \
  src/gozer.js \
  src/ss.js \
  src/resources.js \
  src/skins.js \
  src/clans.js \
  src/main.js > build/ss.js

minify_source build/ss.js build/ss.min.js
cat build/ss.js > mods/js/ss.js
cat build/ss.min.js > mods/js/ss.min.js
cat build/ss.js > chrome/js/ss.js
cat build/ss.min.js > chrome/js/ss.min.js

mkdir -p chrome/css # in case the dir doesn't exist.
minify_source mods/css/style.css mods/css/style.min.css
cat mods/css/style.min.css > chrome/css/style.min.css

# Make the chrome/opera extension upload package
rm -f build/*.zip
rsync -var --delete \
  --exclude "js/ss.js" \
  --exclude "css/style.css" \
  ./chrome/ ./build/ss-mods-chrome
find build -name ".DS_Store" -delete
cd build && zip -rvT ss-mods-chrome.zip ss-mods-chrome

exit 0

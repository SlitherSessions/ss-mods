#!/bin/bash

# The MIT License (MIT)
# Copyright (c) 2016 Kushview, LLC.  All rights reserved.
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

# Splice out the bot code we care about
awk 'NR >= 0 && NR < 2115' vendor/bot-ce/bot.user.js > src/bot.js

cat src/bot.js src/ss.js src/skins.js src/clans.js \
  src/main.js > build/ss.js
yuicompressor -o build/ss.min.js build/ss.js
cat build/ss.js > mods/js/ss.js
cat build/ss.min.js > mods/js/ss.min.js
cat build/ss.js > chrome/js/ss.js
cat build/ss.min.js > chrome/js/ss.min.js

mkdir -p chrome/css # in case the dir doesn't exist.
yuicompressor -o mods/css/style.min.css mods/css/style.css
cat mods/css/style.min.css > chrome/css/style.min.css

# Make the chrome extension upload package
rm -f *.zip
zip -rvT slither-sessions-chrome.zip chrome

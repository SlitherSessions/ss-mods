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

set -e

./build.sh

find . -name '.DS_Store' -delete
echo "=== Uploading MODS ==="
aws s3 sync ./mods s3://mods.slithersessions.com  --acl "public-read" --delete \
  --exclude ".DS_Store" \
  --exclude "sync-s3.sh" \
  --exclude "build.sh" \
  --exclude "*git*" \
  --exclude ".gitignore" \
  --exclude "js/main.js" \
  --exclude "js/ss.js" \
  --exclude "js/social.js" \
  --exclude "test.html" \
  --exclude "src*" \
  --exclude "chrome*" \
  --exclude "*.zip"

#!/bin/bash
set -e
#206.191.154.84:446
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
  --exclude "js/social.js" \
  --exclude "test.html" \
  --exclude "src*" \
  --exclude "chrome*" \
  --exclude "*.zip"

echo
echo "=== Uploading WWW ==="
aws s3 sync ./www s3://www.slithersessions.com  --acl "public-read" --delete \
  --exclude ".DS_Store" \
  --exclude "sync-s3.sh" \
  --exclude "build.sh" \
  --exclude "*git*" \
  --exclude ".gitignore" \
  --exclude "test.html" \
  --exclude "src*" \
  --exclude "chrome*" \
  --exclude "*.zip" \
  --exclude "www/save*"

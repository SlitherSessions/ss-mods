#!/bin/bash
set -e

./build.sh

find . -name '.DS_Store' -delete
exec aws s3 sync ./ s3://mods.slithersessions.com --acl "public-read" \
  --delete --exclude ".DS_Store" --exclude "sync-s3.sh" \
  --exclude "build.sh" \
  --exclude "*git*" \
  --exclude ".gitignore" \
  --exclude "js/main.js" \
  --exclude "js/social.js" \
  --exclude "test.html"

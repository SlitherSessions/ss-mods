#!/bin/bash
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

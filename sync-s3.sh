#!/bin/bash
set -e
find . -name '.DS_Store' -delete
exec aws s3 sync ./ s3://slither.kushview.net --acl "public-read" \
  --delete --exclude ".DS_Store" --exclude "sync-s3.sh" \
  --exclude "*git*" --exclude ".gitignore"

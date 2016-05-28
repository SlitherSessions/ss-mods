#!/bin/bash

set -ex

yuicompressor -o js/main.min.js js/main.js
yuicompressor -o js/main.min.js js/main.js
yuicompressor -o css/style.min.css css/style.css

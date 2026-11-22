#!/bin/sh
# Publish to Cloudflare Pages: https://daevanion-planner.pages.dev
# A Pages address carries only the project name, never the account's. Only the site's own files are uploaded.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir dist
cp index.html planner.css tokens.css base.css board.js planner.js character.js dist/
cp worker.js dist/_worker.js   # Pages runs this for every request: /api is the relay, the rest are files
npx --yes wrangler pages deploy dist --project-name daevanion-planner --branch main --commit-dirty=true --commit-message "deploy"

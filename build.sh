#!/bin/sh
# Collect the files the site serves into dist/. Nothing else in the repo is published.
set -e
cd "$(dirname "$0")"
node daevanion/planner.js          # self-test: a broken planner does not get published
rm -rf dist && mkdir dist
cd daevanion && cp index.html planner.css tokens.css base.css board.js planner.js character.js ../dist/
# which commit is live: https://daevanion.walior.it/version.txt
cd .. && (echo "${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD)}" | cut -c1-7) > dist/version.txt

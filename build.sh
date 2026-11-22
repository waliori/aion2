#!/bin/sh
# Collect the files the site serves into dist/. Nothing else in the repo is published.
set -e
cd "$(dirname "$0")"
node daevanion/planner.js          # self-test: a broken planner does not get published
node daevanion/i18n.js             # and neither does a page with untranslated text
rm -rf dist && mkdir dist
cd daevanion && cp index.html planner.css tokens.css base.css i18n.js boards.js planner.js character.js ui.js ../dist/
# which commit is live: https://daevanion.walior.it/version.txt
cd .. && (echo "${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD)}" | cut -c1-7) > dist/version.txt

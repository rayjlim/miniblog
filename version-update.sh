#!/bin/bash

npx standard-version
cd backend
composer update
git add composer.lock
git commit -m "sync up composer.lock"
branch_name=$(git rev-parse --abbrev-ref HEAD)
echo $branch_name
git push --follow-tags  --set-upstream origin $branch_name
cd ..

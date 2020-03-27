#!/bin/bash
PREP_DIR='../smsblog_prod'
mkdir $PREP_DIR

echo "use upload-prep.sh -w to not build webpacknpm "

rsync -ravz --exclude-from 'exclude-from-prep.txt' --delete . $PREP_DIR
rsync -avz  _rsc/vendor $PREP_DIR/_rsc
rsync -avz  _config/SERVER_CONFIG.php.prod $PREP_DIR/backend/_config/SERVER_CONFIG.php
rsync -avz  _config/.htaccess $PREP_DIR/
rsync -avz  _config/cron_script.php $PREP_DIR/
rsync -avz  exclude-from-prod.txt $PREP_DIR/


cd ui-react
npm run build
cd ..
rsync -avz  ui-react/build/ $PREP_DIR/react

pushd .
cd $PREP_DIR
/usr/local/bin/composer install  --no-dev

npm install --production
if [ $# -ne 1 ]; then
    echo "webpack prod"
    ./node_modules/.bin/webpack --config webpack-prod.config.js -p
fi 

echo "build ready"
popd
#!/bin/bash
PREP_DIR='../smsblog_prod'
mkdir $PREP_DIR

rsync -ravz --exclude-from 'exclude-from-prep.txt' --delete . $PREP_DIR
rsync -avz  _rsc/vendor $PREP_DIR/_rsc
rsync -avz  _config/prod/SERVER_CONFIG.php $PREP_DIR/backend/
rsync -avz  _config/.htaccess $PREP_DIR/
rsync -avz  _config/cron_script.php $PREP_DIR/
rsync -avz  exclude-from-prod.txt $PREP_DIR/

pushd .
cd $PREP_DIR
/usr/local/bin/composer install  --no-dev

npm install --production
if [ $# -ne 1 ]; then
    ./node_modules/.bin/webpack --config webpack-prod.config.js -p
fi 

echo "build ready"
popd
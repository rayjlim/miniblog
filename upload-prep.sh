#!/bin/bash
PREP_DIR='../smsblog_prod'
mkdir $PREP_DIR

echo "use upload-prep.sh -w to not build webpacknpm "

rsync -ravz --exclude-from 'exclude-from-prep.txt' --delete . $PREP_DIR
rsync -avz  _rsc/vendor $PREP_DIR/_rsc
rsync -avz  "_config/bluehost/SERVER_CONFIG.php"  $PREP_DIR/backend/SERVER_CONFIG.php
rsync -avz  _config/.htaccess $PREP_DIR/
rsync -avz  _config/cron_script.php $PREP_DIR/
rsync -avz  exclude-from-prod.txt $PREP_DIR/

cd ui-react
npm run build


cd ..

rsync -ravz  ui-react/build/ $PREP_DIR/

pushd .
cd $PREP_DIR
/usr/local/bin/composer install  --no-dev


echo "build ready"
popd
#!/bin/bash
. ./upload.sh
PREP_DIR='../smsblog_prod'
mkdir $PREP_DIR

rsync -ravz  --exclude-from 'exclude-list.txt' --delete . $PREP_DIR
rsync -avz  _config/prod/SERVER_CONFIG.php $PREP_DIR/backend/
rsync -avz  _config/.htaccess $PREP_DIR/

pushd .
cd $PREP_DIR

/usr/local/bin/composer install  --no-dev

echo "start upload"

# # setup passwordless ssh
# ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
# ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST

# rsync -r -a -v -e  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude 'uploads' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

popd
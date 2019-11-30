#!/bin/bash
. ./upload.sh
PREP_DIR='../smsblog_prod'
pushd .
cd $PREP_DIR

echo "start upload"

# # setup passwordless ssh
# ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
# ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST

rsync -r -a -v -e  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude-from 'exclude-from-prod.txt' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

popd
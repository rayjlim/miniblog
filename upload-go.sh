#!/bin/bash
. ./env_vars.sh
PREP_DIR='../smsblog_prod'
pushd .
cd $PREP_DIR

echo "start upload"
echo $#
# # setup passwordless ssh
if [ $# -eq 1 ]; then
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi
rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude-from 'exclude-from-prod.txt' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

popd
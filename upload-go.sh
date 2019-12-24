#!/bin/bash
. ./env_vars.sh
if ![ -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi
PREP_DIR='../smsblog_prod'

echo "Usage: " $0 " [option reset key]"
pushd .
cd $PREP_DIR

echo "start upload"
echo $#
# # setup passwordless ssh
if [ $# -eq 1 ]; then
  echo "Reset ssh key"
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi
rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude-from 'exclude-from-prod.txt' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

popd
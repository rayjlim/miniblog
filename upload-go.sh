#!/bin/bash
. ./env_vars.sh

if [ ! -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi

echo "Usage: " $0 " [option reset key]"
while getopts r option
do
case "${option}"
in
r) RESETSSH=${OPTARG} && echo 'reset ssh';;
esac
done

PREP_DIR='../smsblog_prod'

cd $PREP_DIR
echo "start upload"

if [ ! -z $RESETSSH ]; then
  echo "Reset ssh key"
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi

rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude-from 'exclude-from-prod.txt' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

ssh  $FTP_USER@$FTP_HOST "chmod 755 $FTP_TARGETFOLDER"
#!/bin/bash
. ./env_vars.sh

if [ ! -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi

echo "Usage: " $0 " [option reset key]"

usage() {

  echo ""
  echo "Usage: "$0" [-s] [-r]"
  echo ""
  echo "  -s to Skip Build Step"
  echo "  -r to reset SSH connection"
  echo ""
}

while getopts rs option
do
    case "${option}" in
    r) RESETSSH=true;;
    s) BUILD=true;;
    [?])  usage
        exit 1;;
    esac
done

PREP_DIR='../smsblog_prod'

if [ -z "$BUILD" ]; then

  rsync -ravz --exclude-from 'exclude-from-prep.txt' --delete . $PREP_DIR
  rsync -avz  _rsc/vendor $PREP_DIR/_rsc
  rsync -avz  "_config/bluehost/SERVER_CONFIG.php"  $PREP_DIR/backend/SERVER_CONFIG.php
  rsync -avz  _config/.htaccess $PREP_DIR/
  rsync -avz  exclude-from-prod.txt $PREP_DIR/

  cd ui-react
  npm run build
  buildresult=$?

  if [ $buildresult != 0 ]; then
    echo "REACT Build Fail"
    exit 1
  fi

  cd ..

  rsync -ravz  ui-react/build/ $PREP_DIR/

  pushd .
  cd $PREP_DIR
  /usr/local/bin/composer install  --no-dev
  chmod 755 *.php

  echo "build ready"
else
  echo "Skip Build"
  cd $PREP_DIR
fi

echo "start upload"

if [ ! -z $RESETSSH ]; then
  echo "Reset ssh key"
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi

rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' --exclude-from 'exclude-from-prod.txt' --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

ssh  $FTP_USER@$FTP_HOST "chmod 755 $FTP_TARGETFOLDER"
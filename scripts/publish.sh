#!/bin/bash
. .env

if [ ! -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi

echo "Usage: " $0 " [option reset key]"

usage() {

  echo ""
  echo "Usage: "$0" [-s] [-r]"
  echo ""
  echo "  -b to Skip Backend Step"
  echo "  -f to Skip Frontend Step"
  echo "  -r to reset SSH connection"
  echo ""
}

while getopts rbf option
do
    case "${option}" in
    r) RESETSSH=true;;
    b) NOBACKENDBUILD=true;;
    f) NOFRONTENDBUILD=true;;
    [?])  usage
        exit 1;;
    esac
done

if [ -z "$NOBACKENDBUILD" ]; then
  mkdir -p ../backend/build
  cd ../backend
  rsync -ravz --exclude-from '../scripts/exclude-from-prep.txt' --delete . ./build
  # rsync -avz  _rsc/vendor $PREP_DIR/_rsc
  rsync -avz  ".env.production"  ./build/.env
  rsync -avz  ".htaccess.production"          ./build/.htaccess
  rsync -avz  "../scripts/exclude-from-prod.txt"   ./build

  cd ./build
  /usr/local/bin/composer install  --no-dev
  chmod 755 *.php

  echo "build ready"
  cd ../..
else
  echo "Skip Build"
  cd ..
fi

echo "start frontend build"
pwd
if [ -z "$NOFRONTENDBUILD" ]; then

  cd ./frontend
  npm run build
  buildresult=$?
  if [ $buildresult != 0 ]; then
    echo "REACT Build Fail"
    exit 1
  fi
  rsync -avz  ".htaccess.production"          ./dist/.htaccess
  cd ..
fi

echo "start upload"

# setup passwordless ssh
if [ ! -z $RESETSSH ]; then
    echo "Reset ssh key"
    ssh-keygen -f $KEY_DIR -R $FTP_HOST
    ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
else
    echo "Skip SSH Reset"
fi

if [ -z "$NOBACKENDBUILD" ]; then
  echo "start upload API"
  cd ./backend/build
  pwd
  echo $FTP_TARGETFOLDER_API
  rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' \
    --exclude-from 'exclude-from-prod.txt' \
    --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER_API/

  ssh  $FTP_USER@$FTP_HOST "chmod -R 755 $FTP_TARGETFOLDER_API/"
  cd ../..
fi

if [ -z "$NOFRONTENDBUILD" ]; then
  echo "start upload UI"
  cd ./frontend/dist
  pwd
  echo $FTP_TARGETFOLDER_UI
  rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' \
    --delete . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER_UI/

  ssh  $FTP_USER@$FTP_HOST "chmod -R 755 $FTP_TARGETFOLDER_UI/"
  cd ../..
fi

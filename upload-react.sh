#!/bin/bash
echo "use upload-react.sh -s 1 to not build react app "
. ./env_vars.sh

if [ ! -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi

while getopts r:s:c: option
do
case "${option}"
in
r) RESETSSH=${OPTARG} && echo 'reset ssh';;
s) BUILD=${OPTARG} && echo 'skip build';;
c) CLEAN=${OPTARG} && echo 'clean old prod';;
esac
done

if [ ! -z $CLEAN ]; then
  cd ui-react/build/static

  STATIC_DIR=$FTP_TARGETFOLDER"static/"
  echo $STATIC_DIR
  pwd
  rsync -rave 'ssh -oHostKeyAlgorithms=+ssh-dss' --delete  . $FTP_USER@$FTP_HOST:$STATIC_DIR

  exit 0
fi

cd ui-react

if [ -z $BUILD ]; then
  npm run build
fi

# # setup passwordless ssh
if [ ! -z $RESETSSH ]; then
  echo "Reset ssh key"
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi

cd build
# --dry-run
rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss'  . $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 



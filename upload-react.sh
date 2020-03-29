#!/bin/bash
echo "use upload-react.sh -b to not build react app "
. ./env_vars.sh

if ![ -n "$FTP_HOST" ]; then
    echo "Missing env_vars"
    exit 2
fi

while getopts r:s: option
do
case "${option}"
in
r) RESETSSH=${OPTARG} && echo 'reset ssh';;
s) BUILD=${OPTARG} && echo 'skip build';;
esac
done

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

pwd
cd static
STATIC_DIR=$FTP_TARGETFOLDER"static/"
echo $STATIC_DIR

rsync -rave 'ssh -oHostKeyAlgorithms=+ssh-dss' --delete  . $FTP_USER@$FTP_HOST:$STATIC_DIR

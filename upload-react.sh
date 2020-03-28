#!/bin/bash
echo "use upload-react.sh -w to not build webpacknpm "
. ./env_vars.sh

cd ui-react

npm run build

# # setup passwordless ssh
if [ $# -eq 1 ]; then
  echo "Reset ssh key"
  ssh-keygen -f "/home/ray/.ssh/known_hosts" -R $FTP_HOST
  ssh-copy-id -f -i ~/.ssh/id_rsa -oHostKeyAlgorithms=+ssh-dss $FTP_USER@$FTP_HOST
fi
rsync -rave  'ssh -oHostKeyAlgorithms=+ssh-dss' build/ $FTP_USER@$FTP_HOST:$FTP_TARGETFOLDER 

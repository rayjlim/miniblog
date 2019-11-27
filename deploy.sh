#!/bin/bash

var=${DEPLOY_ENV:-default_value}

#!/bin/bash
HOST=${SFTP_HOST:-default_value}
USER=${SFTP_USER:-default_value}
PASSWD=${SFTP_PASSWORD:-default_value}

ftp -n -v $HOST << EOT
ascii
user $USER $PASSWD
prompt
cd smsblog
cd _rsc
cd js_build
put ./_rsc/js_build/app.bundle.js.gz

bye
EOT
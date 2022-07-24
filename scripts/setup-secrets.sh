#!/bin/bash

# starts in scripts folder
gpg -d --passphrase-fd passfile.txt --output .env .env.asc
cd ..

cd frontend
gpg -d --passphrase-fd ../scripts/passfile.txt --output .env .env.asc
cd ..

cd backend
gpg -d --passphrase-fd ../scripts/passfile.txt --output .env .env.asc

gpg -d --passphrase-fd ../scripts/passfile.txt --output .env.production .env.production.asc

cd config
gpg -d --passphrase-fd ../../scripts/passfile.txt --output .htaccess .htaccess.asc

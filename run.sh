#!/bin/sh
set -e

echo "acquiring certificate $WILDCARD_DOMAIN for Heroku app $HEROKU_APP"

# letsencrypt staging:
# https://acme-staging-v02.api.letsencrypt.org/directory
# letsencrypt production:
# https://acme-v02.api.letsencrypt.org/directory

certbot certonly \
  --manual \
  -n \
  --preferred-challenges=dns \
  --manual-auth-hook ./authook.sh \
  --email dirk@bonkeybong.com \
  --server https://acme-staging-v02.api.letsencrypt.org/directory \
  --agree-tos \
  --manual-public-ip-logging-ok \
  --work-dir ./letsencrypt/certs \
  --logs-dir ./letsencrypt/logs \
  --config-dir ./letsencrypt/config \
  -d *.$WILDCARD_DOMAIN

echo "Finished running certbot, adding domain to Heroku"

cd ./letsencrypt/config/live/$WILDCARD_DOMAIN/

ls
heroku certs:update fullchain.pem privkey.pem -a $HEROKU_APP
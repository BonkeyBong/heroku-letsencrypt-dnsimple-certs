#!/bin/sh
set -e

echo "acquiring certificate $WILDCARD_DOMAIN"

./certbot-auto certonly \
  --manual \
  --preferred-challenges=dns \
  --email info@example.com \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --agree-tos \
  -d $WILDCARD_DOMAIN
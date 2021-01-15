#!/bin/sh
set -e

echo "running authook"

node dnsChallenge.js $CERTBOT_DOMAIN $CERTBOT_VALIDATION

sleep 60 # allow time for DNS TXT record to propagate
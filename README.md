# Cert Renewal
A script to generate LetsEncrypt SSL certificates for a wildcard domain using DNSimple and Heroku

This repository contains scripts to generate a wildcard SSL certificate for a given domain from
LetsEncrypt. The domain is automatically validated through the DNS Simple API using DNS TXT records,
and then the cert is added to Heroku.

Required dependencies:
- certbot CLI
- Heroku CLI, authorized
- Node.js version 14

All dependencies are found in the supplied Dockerfile.

## Instructions for setting up cronjob to automatically update cert

1. Install required dependencies, listed above
1. Clone this repo onto the server
1. Run `npm install` at the repo root
1. Run `cp secrets.example secrets.json` and edit the secrets.json to add the DNSimple API token
1. Add a cronjob that will run the `run.sh` script every 60 days.
  1. `run.sh` takes two environment variables: `WILDCARD_DOMAIN` and `HEROKU_APP`
  1. `0 0 1 FEB,APR,JUN,AUG,OCT,DEC * WILDCARD_DOMAIN=example.com HEROKU_APP=my-heroku-app /path/to/run.sh` # Runs at the beginning of each listed month


## Instructions for manually running Docker image and generating certs

1. Build and run the docker image. From the root directory:
```
docker build -t eimpact/certrenewal .
docker run -it --entrypoint="/bin/sh" eimpact/certrenewal
```

The `run.sh` script that's executed by the Dockerfile will do the same thing, but needs
to be updated with the correct email address.

2. Run the certbot command:
```
certbot certonly \
  --manual \
  --preferred-challenges=dns \
  --email dirk@bonkeybong.com \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --agree-tos \
  -d *.example.com
```

3. Login to dnsimple.com and update the TXT record as prompted by certbot
https://dnsimple.com/

4. Finish the certbot prompts, then copy the generated cert. From a local terminal, outside of Docker, run:
```
# great_williamson is the container name generated by docker. See `docker ps` to get the name
docker cp great_williamson:/etc/letsencrypt/archive/ ./letsencrypt
```

5. Now from the letsencrypt directory created in the last step, add the cert to Heroku:
```
  cd ./letsencrypt/eimpactv2.report
  heroku certs:update fullchain1.pem privkey1.pem -a my-heroku-app
```
FROM certbot/certbot

ENV WILDCARD_DOMAIN *.economicimpact.report

COPY . .

ENTRYPOINT ["/bin/sh", "./run.sh"]
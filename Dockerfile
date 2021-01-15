FROM certbot/certbot

RUN apk add --update npm

ENV WILDCARD_DOMAIN *.economicimpact.report

COPY . .

RUN npm install

ENTRYPOINT ["/bin/sh", "./run.sh"]
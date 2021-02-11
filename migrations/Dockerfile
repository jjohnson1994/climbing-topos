FROM node:15.5-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . .

RUN npm install -g db-migrate db-migrate-pg

CMD /wait && db-migrate --config config/database.json up
CMD tail -f /dev/null


FROM node:15.5-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN apk add \
      python \
      make \
      g++

RUN npm install --legacy-peer-deps
RUN npm install -g serverless

COPY . .

CMD ["npm", "start"]

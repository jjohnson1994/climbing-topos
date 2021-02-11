FROM node:15.5-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN apk add \
      python \
      make \
      g++

RUN npm install --legacy-peer-deps \
    && npm install -g react-scripts@^4.0.1 \
    && npm install -g typescript

COPY . .

CMD ["npm", "start"]

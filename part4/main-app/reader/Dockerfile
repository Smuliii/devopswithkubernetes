FROM node:16.3.0-alpine3.13

EXPOSE 3001

WORKDIR /app

RUN apk update && apk add curl

COPY package*.json ./

RUN npm config set update-notifier false && \
	npm i

COPY . ./

CMD [ "npm", "start" ]

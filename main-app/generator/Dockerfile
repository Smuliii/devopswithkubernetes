FROM node:16.3.0-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm config set update-notifier false && \
	npm i

COPY . ./

CMD [ "npm", "start" ]

FROM node:16.3.0-alpine3.13

EXPOSE 3002
ENV FILE_PATH=/app/files

WORKDIR /app

COPY package*.json ./

RUN npm config set update-notifier false && \
	npm i

COPY . ./

CMD [ "npm", "start" ]

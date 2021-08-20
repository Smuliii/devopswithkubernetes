FROM node:16.3.0-alpine3.13

EXPOSE 3001
ENV FILE_PATH=/app/files
ENV PINGPONG_URL=http://localhost:3002

WORKDIR /app

COPY package*.json ./

RUN npm config set update-notifier false && \
	npm i

COPY . ./

CMD [ "npm", "start" ]

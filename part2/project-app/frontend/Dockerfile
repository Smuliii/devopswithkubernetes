FROM node:16.3.0-alpine3.13

EXPOSE 3003
ENV FILE_PATH=/app/files
ENV BACKEND_URL=http://localhost:3004
ENV FORM_URL=http://localhost:3004

WORKDIR /app

COPY package*.json ./

RUN npm config set update-notifier false && \
	npm i

COPY . ./

CMD [ "npm", "start" ]

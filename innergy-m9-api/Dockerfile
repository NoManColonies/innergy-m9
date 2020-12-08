FROM node:15.3.0-alpine3.12
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install --global @adonisjs/cli
EXPOSE 3333
CMD ["yarn", "start"]

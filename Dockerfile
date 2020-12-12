FROM node:15.3.0-alpine3.12

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY . /app

# RUN npm install --global @adonisjs/cli

EXPOSE 3333

CMD ["yarn", "start"]

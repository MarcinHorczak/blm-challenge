FROM node:8

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/
RUN yarn install

COPY . /usr/app

EXPOSE 8080

CMD ["yarn", "run", "dev"]

FROM node:16-alpine

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./
RUN yarn --production --frozen-lockfile --link-duplicates && yarn add tsc

COPY . .
RUN yarn build

CMD [ "yarn", "start" ]


FROM node:16-alpine
WORKDIR /chatbot
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
CMD node app.js
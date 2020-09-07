FROM mhart/alpine-node:12

# RUN apt-get update
# RUN apt-get -y install curl

# RUN apt-get -y install build-essential && \
#     apt-get -y install git && \
#     apt-get install -y nodejs

# COPY package*.json .

# RUN npm install

COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python
RUN npm rebuild node-sass

EXPOSE 3000

RUN npm run deploy

# FROM node:lts-alpine

# WORKDIR mkdir -p /app
# WORKDIR /app

# COPY package*.json .
# RUN npm install
# RUN npm install node-sass

# COPY . ./

# EXPOSE 3000

# CMD npm start

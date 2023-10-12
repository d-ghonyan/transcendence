FROM node:latest

WORKDIR /nest

COPY package*.json ./

RUN npm i

COPY . .

ENTRYPOINT ["npm", "run", "start:dev", "--", "-b", "swc"]
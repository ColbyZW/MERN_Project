FROM node:18-alpine

WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm install

COPY . /src
EXPOSE 8000

CMD ["node", "server.js"]
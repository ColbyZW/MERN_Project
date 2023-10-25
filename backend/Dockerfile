FROM node:18-alpine

WORKDIR /
COPY package.json package-lock.json ./
RUN npm install
ENV PATH=/node_modules/.bin:$PATH

WORKDIR /src

RUN npm install -g nodemon

EXPOSE 8000

CMD ["nodemon", "-L", "server.js"]
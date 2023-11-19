FROM node:18-alpine as base

FROM base as dev
WORKDIR /
COPY package.json package-lock.json ./
ENV PATH=/node_modules/.bin:$PATH
RUN npm install

WORKDIR /src

EXPOSE 3000
CMD ["npm", "start"]

FROM base as prod
WORKDIR / 
COPY . /
RUN npm install
# RUN npm install -g serve

RUN npm run build

CMD ["node", "server.js"]
# CMD ["npm", "run", "deploy"]
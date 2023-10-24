FROM node:18-alpine

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
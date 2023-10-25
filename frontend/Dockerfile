FROM node:18-alpine

WORKDIR /
COPY package.json package-lock.json ./
RUN npm install
ENV PATH=/node_modules/.bin:$PATH

WORKDIR /src

EXPOSE 3000

CMD ["npm", "start"]
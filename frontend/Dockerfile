FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm list axios

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "dist"]

FROM node:20.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3001

CMD ["npm", "start"]

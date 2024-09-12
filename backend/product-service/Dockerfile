FROM node:16

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install

COPY . .

# Rebuild bcrypt for the correct environment
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3002
CMD ["npm", "start"]
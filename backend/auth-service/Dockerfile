# Use the Node.js 16 base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Expose the port
EXPOSE 3001

# Start the auth service
CMD ["node", "server.js"]

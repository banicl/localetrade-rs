# Use Node.js as the base image
FROM node:20.10.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt to match the Docker environment
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the service's port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]

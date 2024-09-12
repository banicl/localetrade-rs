# Use Node.js as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json, and install dependencies
COPY package*.json ./
RUN npm install

# Debugging step to check if axios is installed correctly
RUN npm list axios

# Copy the rest of the frontend application code
COPY . .

# Build the Vue.js app
RUN npm run build

# Install 'serve' globally to serve the production build
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 8080

# Start the app using 'serve'
CMD ["serve", "-s", "dist"]

# Use an official optimized Node runtime as a parent image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker caching for layers
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your backend source code
COPY . .

# Expose the port your server.js runs on (change if your app uses a different port)
EXPOSE 5000

# Command to run the application
CMD [ "node", "server.js" ]
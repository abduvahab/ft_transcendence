# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port that your Nest.js app will run on (default is 3000)
# EXPOSE 3000,3001

# Define the command to run your application
CMD ["npm", "run", "start:dev"]
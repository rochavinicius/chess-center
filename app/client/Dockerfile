# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:20-alpine 
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build

FROM node:slim
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
USER node
# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npx", "serve", "build" ]
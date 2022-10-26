# https://medium.com/@ankit.wal/the-why-and-how-of-multi-stage-docker-build-with-typescript-example-bcadbce2686c
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#handling-kernel-signals
# https://github.com/denpalrius/docker-nestjs-starter/blob/master/Dockerfile
# https://sanderknape.com/2019/06/installing-private-git-repositories-npm-install-docker/
# https://itsopensource.com/how-to-reduce-node-docker-image-size-by-ten-times/

# -------------------- Build with devDependencies --------------------
FROM node:16.14.2-alpine AS builder
# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
RUN mkdir -p /usr/src/app/node_modules

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
RUN npm ci

# Bundle app source
COPY --chown=node:node . ./

RUN npm run prebuild
RUN npm run build

# Remove devDependencies from node modules.
RUN npm prune --production

# -------------------- production --------------------
FROM node:16.14.2-alpine AS production

# For handling Kernel signals properly
RUN apk add --no-cache tini git openssh-client

# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
RUN mkdir -p /usr/src/app/node_modules

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).
USER node

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
# RUN npm i -g @nestjs/cli
RUN npm ci --only=production

# Necessary to run before adding application code to leverage Docker cache
RUN npm cache clean --force

# Bundle app source
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Display directory structure
RUN ls -al

# Run the web service on container startup
CMD [ "npm", "run", "start:deploy" ]

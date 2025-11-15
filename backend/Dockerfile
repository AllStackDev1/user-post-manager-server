# Use the official Node.js 22 LTS image as the base
# Using node:22-slim is a good balance between size and functionality.
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install necessary build tools, including a stable Python version (like 3.11) 
# and make, which are required by node-gyp for compiling native modules (like sqlite3).
# We use apt-get for Debian-based slim image.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3.11 \
        python3.11-distutils \
        make \
        g++ \
        build-essential && \
    # Ensure that `python3.11` is the default python for node-gyp
    update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1 && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    # Clean up APT cache to keep the image size small
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first to leverage Docker's build cache
# This means npm install won't rerun if only the source code changes.
COPY package*.json ./

# Install project dependencies
# This step will successfully run node-gyp using the configured Python 3.11 with distutils.
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the backend is expected to run on (e.g., 3000, 8080, 5000)
# **IMPORTANT**: You might need to change 3000 to the actual port your backend uses.
EXPOSE 3001

# The CMD should now use nodemon, which will pick up your nodemon.json config
# Assuming `npm run dev` is defined in your package.json to call nodemon.
# If `npm start` is configured to run nodemon, keep `CMD [ "npm", "start" ]`.
# Based on your nodemon.json, the correct start command is usually `npm run dev` or a specific nodemon command.
CMD [ "npm", "run", "dev" ]
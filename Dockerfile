FROM node:12

# Create app directory
WORKDIR /usr/src

# Copy app files to source
COPY . .

    # Install initial dependencies for transpiling
RUN npm install --save-dev @babel/core @babel/node @babel/cli @babel/preset-env node-sass && \
    # Transpile js into dist directory & copy all other files (njks templates etc)
    npx --no-install babel app -d dist/app --copy-files && \
    # Transpile main.js to public/js/main.bundle
    npx --no-install babel app/scripts/main.js -o dist/public/js/main.bundle.min.js && \
    # Convert sass into css
    npx --no-install node-sass --output-style compressed app/styles/main.scss dist/public/css/main.min.css && \
    # Install prod dependencies inside the dist directory
    cp package.json dist && cd dist && npm install --only=prod && cd .. && \
    #npm install --prefix ./dist ./ --only=prod && \
    # Remove all files apart from the dist sub-directory
    find ./ -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Expose port 
EXPOSE 3005

WORKDIR /usr/src/dist/app

# Set default env. variable
ENV NODE_ENV=production

# Run app
CMD [ "node", "server.js"]

USER node

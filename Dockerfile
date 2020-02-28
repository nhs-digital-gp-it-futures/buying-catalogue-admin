FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Copy app files to source
COPY . .

# Install initial dependencies for transpiling
RUN npm install --save-dev @babel/core @babel/node @babel/cli @babel/preset-env

# Transpile js into dist directory & copy all other files (njks templates etc)
RUN npx babel app.js server.js -d dist && npx babel app -d dist/app --copy-files

# Transpile main.js to public/js/main.bundle
RUN npx babel app/scripts/main.js -o dist/public/js/main.bundle.min.js

# Convert sass into css
RUN npx node-sass --output-style compressed app/styles/main.scss dist/public/css/main.min.css

# Install prod dependencies inside the dist directory
RUN cp package.json dist && cd dist && npm install --only=prod

# Remove all files apart from the dist sub-directory
RUN find ./ -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

# Expose port 
EXPOSE 3005

# Run app
CMD [ "node", "dist/server.js"]

USER node
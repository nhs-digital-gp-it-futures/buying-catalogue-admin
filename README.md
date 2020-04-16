

# Buying Catalogue Admin

  

Nodejs with Express app to present the admin pages for authority users.

  

## Requirements
- Node 12

Install the long-term support (LTS) version of <a href="https://nodejs.org/en/">Node.js</a>, which includes NPM.

  

## Setting up
```
git clone https://github.com/nhs-digital-gp-it-futures/buying-catalogue-admin.git
cd buying-catalogue-admin
npm install
```
## Running the application
- Run - `npm run start:dev`
- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`

You should now be able to view the dashboard at [http://localhost:3005/admin/organisation](http://localhost:3005/admin/organisation)

## Debugging the application

 1. In Visual Studio Code, go to Preferences > Settings and search for 'node debug' and turn the 'Auto Attach' option ON.
 2. Insert breakpoint/s.
 3. In Visual Studio Code, open the integrated terminal and run `npm run debug`

## Dependencies
### Buying Catalogue Identity
In order for the app to function properly, make sure you have an instance of the Buying Catalogue Identity in dev. environment running. How to set up the [Buying Catalogue Identity](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueIdentity/blob/master/README.md#running-the-application "Identity Server Running the application").

### Redis
The app requires Redis memory storage to store the authentication details.
By running the app localy via `npm run start:dev` the docker container with a Redis instance will be started automatically and the app will connect to this.
A useful tool to inspect the Redis cache is [Redis-commander](https://www.npmjs.com/package/redis-commander)
Install this library globally with `npm install -g redis-commander`
Run Redis-commander with `redis-commander -p 9000` this will now allow you to inpect the cache on `http://localhost:9000`
At the bottom of the commander is a redis terminal a useful command is `flushall` to wipe out redis cache back to a clean slate.

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
npm run build
```

## Running the tests
- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`


## Running the application via the cluster
Update the cluster to disable pb via the cluster and a disabledUrl is set. In you `local-overrides.yaml` it will look something like this;
```javascript
admin: 
  enabled: false 
  disabledUrl: "http://localhost:3005/admin"
```

All environment variables are provided a default to work with your local cluster in `config.js` except;

`OIDC_CLIENT_SECRET` and `COOKIE_SECRET`

Add these to your `.env` file in project root. Ask a colleague for their values

Run the app with `npm run start:dev`
Application should now be running on <a href="http://localhost:3005/admin/organisations">http://localhost:3005/admin/organisations</a>.


## Running the application
- Run - `npm run start:dev`
- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`

You should now be able to view the dashboard at [http://localhost:3005/admin/organisation](http://localhost:3005/admin/organisation)

## Running the application locally
Create a `.env` file in the root of the project.
Look at the `Dependencies` section to run each app on your local machine.
Update the `.env` file to point to dependencies

Start local redis in your terminal run `npm run start:redis` this will run your local redis on port `6380`
Add `REDIS_PORT=6380` to you `.env` file

On a seperate terminal run the app with `npm run start:dev`
You should now be able to view the dashboard at [http://localhost:3005/admin/organisation](http://localhost:3005/admin/organisation)

## Dependencies
### Buying Catalogue Identity
[Buying Catalogue API](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueService).

[Document API](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueDocumentService).

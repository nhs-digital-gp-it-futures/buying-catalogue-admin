# Buying Catalogue Admin

Node.js with Express app to present the admin pages for authority users.
  
## Requirements

- Node 14

Install the long-term support (LTS) version of [Node.js](https://nodejs.org/en/), which includes NPM.

## Setting up

```shell
git clone https://github.com/nhs-digital-gp-it-futures/buying-catalogue-admin.git
cd buying-catalogue-admin
npm install
npm run build
```

## Running the tests

- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`

## Running the application via the cluster

Update the cluster to disable pb via the cluster and a disabledUrl is set. In you `local-overrides.yaml` it will look something like this:

```yaml
admin: 
  enabled: false 
  disabledUrl: "http://localhost:3005/admin"
```

All environment variables are provided a default to work with your local cluster in `config.js` except:

`OIDC_CLIENT_SECRET` and `COOKIE_SECRET`

Update your `.env` file in project root with values that are mentioned below:

LOGGER_LEVEL=debug
OIDC_CLIENT_SECRET=SampleClientSecret
COOKIE_SECRET=secret squirrel

Run the app with `npm run start:dev`
Application should now be running on <http://localhost:3005/admin/organisations>.

## Running the application

- Run - `npm run start:dev`
- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`

You should now be able to view the dashboard at <http://localhost:3005/admin/organisation>.

## Running the application locally

Create a `.env` file in the root of the project.
Look at the `Dependencies` section to run each app on your local machine.
Update the `.env` file to point to dependencies

Start local redis in your terminal run `npm run start:redis` this will run your local redis on port `6380`
Add `REDIS_PORT=6380` to you `.env` file

In a separate terminal run the app with `npm run start:dev`
You should now be able to view the dashboard at [http://localhost:3005/admin/organisation](http://localhost:3005/admin/organisation)

## Dependencies

### Buying Catalogue Identity

[Buying Catalogue API](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueService).

[Document API](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueDocumentService).

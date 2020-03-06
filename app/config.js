module.exports = {
  // App name
  appName: 'NHSD Buying Catalogue Admin',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3005,

  // The base uri the app is running on to pass to identity service for redirection
  appBaseUri: process.env.APP_BASE_URI || 'http://localhost:3005',

  // IDENTITY_SERVER
  // TODO: Port will need changed
  identityServer: process.env.IDENTITY_SERVER || 'http://localhost:8080',

  // LOGGER_LEVEL options are info, warn, error, off
  loggerLevel: process.env.LOGGER_LEVEL || 'error',

  // The base uri of identity service
  oidcBaseUri: process.env.OIDC_BASE_URI || 'http://localhost:8070',

  // The client id to be sent to identity service
  oidcClientId: process.env.OIDC_CLIENT_ID || 'SampleClient',

  // The secret need to decode JWT tokens
  oidcClientSecret: process.env.OIDC_CLIENT_SECRET,
};

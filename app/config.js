module.exports = {
  // App name
  appName: 'NHSD Buying Catalogue Admin',

  // Base URL
  baseUrl: process.env.BASE_URL || '/admin',

  // Public browse base URL
  publicBrowseBaseUrl: process.env.PUBLIC_BROWSE_BASE_URL || 'http://localhost:3000/',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3005,

  // The base uri the app is running on to pass to identity service for redirection
  appBaseUri: process.env.APP_BASE_URI || 'http://localhost:3005',

  // IDENTITY_SERVER
  identityServerUrl: process.env.IDENTITY_SERVER || 'http://localhost:5102/identity',

  // ORGANISATION_API_URL
  organisationApiUrl: process.env.ORGANISATION_API_URL || 'http://localhost:8075',

  // LOGGER_LEVEL options are info, warn, error, off
  loggerLevel: process.env.LOGGER_LEVEL || 'error',

  // The base uri of identity service
  oidcBaseUri: process.env.OIDC_BASE_URI || 'http://localhost:5102/identity',

  // The client id to be sent to identity service
  oidcClientId: process.env.OIDC_CLIENT_ID || 'SampleClient',

  // The secret need to decode JWT tokens
  oidcClientSecret: process.env.OIDC_CLIENT_SECRET,

  // The path that the user is redirected to after logout
  logoutRedirectPath: process.env.LOGOUT_REDIRECT_PATH || '/',

  // How long before the cookies stored in the session expire in ms (1 hour)
  maxCookieAge: process.env.MAX_COOKIE_AGE || 3600000,

  // The secret needed for encoding and decoding the cookie
  cookieSecret: process.env.COOKIE_SECRET,

  // The url in which redis is running
  redisUrl: process.env.REDIS_URL || 'localhost',

  // The port redis is running
  redisPort: process.env.REDIS_PORT || 6379,

  // Boolean to indicate whether to connect to redis via TLS
  redisTls: process.env.REDIS_TLS || 'false',

  // The password to connect to redis
  redisPass: process.env.REDIS_PASS,
};

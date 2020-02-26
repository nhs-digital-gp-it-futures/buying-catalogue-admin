module.exports = {
  // App name
  appName: 'NHSD Buying Catalogue Admin',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3002,

  // API_HOST
  apiHost: process.env.API_HOST || 'http://localhost:8080',

  // LOGGER_LEVEL options are info, warn, error, off
  loggerLevel: process.env.LOGGER_LEVEL || 'error',
};

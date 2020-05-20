require('dotenv').config();
const config = require('./config');
const { App } = require('./app');
const { routes } = require('./routes');
const { logger } = require('./logger');
const { isIdentityReady } = require('./helpers/isIdentityReady');
const { createAuthProvider } = require('./helpers/createAuthProvider');

(async () => {
  Object.keys(config).map((configKey) => {
    if (config[configKey]) {
      logger.info(`${configKey} set to ${config[configKey]}`);
    } else {
      logger.error(`${configKey} not set`);
    }
  });

  await isIdentityReady();

  // Create authProvider
  const authProvider = createAuthProvider({ config });

  // Create app
  const app = new App(authProvider).createApp();
  app.use(config.baseUrl, routes(authProvider));

  // Run application on configured port
  if (config.env === 'development') {
    logger.info(`Buying Catalogue Admin - \x1b[35m${config.appBaseUri}${config.baseUrl}/organisations\x1b[0m`);
  } else {
    logger.info(`App listening on port ${config.port} - Buying Catalogue Admin`);
  }
  app.listen(config.port);
})();

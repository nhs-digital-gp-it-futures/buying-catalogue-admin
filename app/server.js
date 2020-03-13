require('dotenv').config();
const config = require('./config');
const { App } = require('./app');
const { AuthProvider } = require('./authProvider');
const { routes } = require('./routes');
const { logger } = require('./logger');

Object.keys(config).map((configKey) => {
  if (config[configKey]) {
    logger.info(`${configKey} set to ${config[configKey]}`);
  } else {
    logger.error(`${configKey} not set`);
  }
});

// Routes
const authProvider = new AuthProvider();
const app = new App(authProvider).createApp();
app.use(config.baseUrl ? config.baseUrl : '/', routes(authProvider));
if (config.baseUrl) {
  app.use('/', (req, res) => {
    res.redirect(config.baseUrl);
  });
}

// Run application on configured port
if (config.env === 'development') {
  logger.info(`Buying Catalogue Admin - \x1b[35m${config.appBaseUri}/organisations\x1b[0m`);
} else {
  logger.info(`App listening on port ${config.port} - Buying Catalogue Admin`);
}
app.listen(config.port);

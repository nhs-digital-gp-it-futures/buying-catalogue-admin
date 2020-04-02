require('dotenv').config();
const util = require('util');
const axios = require('axios');
const config = require('./config');
const { App } = require('./app');
const { AuthProvider } = require('./authProvider');
const { routes } = require('./routes');
const { logger } = require('./logger');

const setTimeoutPromise = util.promisify(setTimeout);

const determineCanAppStart = async ({
  canStartApp, attempt, pollDuration,
}) => {
  if (!canStartApp) {
    try {
      await axios.get(`${config.oidcBaseUri}/.well-known/openid-configuration`);
      return determineCanAppStart({
        canStartApp: true, appType: 'auth', attempt, pollDuration,
      });
    } catch (err) {
      const nextAttempt = attempt + 1;
      const nextPollDuration = nextAttempt * pollDuration;
      logger.error(`Isapi is not ready - will poll again in ${nextAttempt} seconds`);
      return setTimeoutPromise(nextPollDuration).then(() => determineCanAppStart({
        canStartApp: false, attempt: nextAttempt, pollDuration,
      }));
    }
  }

  return canStartApp;
};

(async () => {
  Object.keys(config).map((configKey) => {
    if (config[configKey]) {
      logger.info(`${configKey} set to ${config[configKey]}`);
    } else {
      logger.error(`${configKey} not set`);
    }
  });

  const canAppStart = await determineCanAppStart({
    canStartApp: false, attempt: 1, pollDuration: 1000,
  });

  if (canAppStart) {
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
      logger.info(`Buying Catalogue Admin - \x1b[35m${config.appBaseUri}${config.baseUrl}/organisations\x1b[0m`);
    } else {
      logger.info(`App listening on port ${config.port} - Buying Catalogue Admin`);
    }
    app.listen(config.port);
  }
})();

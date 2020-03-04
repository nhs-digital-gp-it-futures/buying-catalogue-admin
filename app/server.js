require('dotenv').config();
const browserSync = require('browser-sync');
const routes = require('./routes');
const config = require('./config');
const { App } = require('./app');
const { logger } = require('./logger');

Object.keys(config).map((configKey) => {
  if (config[configKey]) {
    logger.info(`${configKey} set to ${config[configKey]}`);
  } else {
    logger.error(`${configKey} not set`);
  }
});

// Routes
const app = new App().createApp();
app.use('/', routes);

// Run application on configured port
if (config.env === 'development') {
  app.listen(config.port - 50, () => {
    browserSync({
      files: ['../public/**/*.*'],
      notify: true,
      open: false,
      port: config.port,
      proxy: `localhost:${config.port - 50}`,
      ui: false,
    });
  });
} else {
  app.listen(config.port);
}

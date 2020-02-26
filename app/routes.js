import express from 'express';
import logger from './logger';
import { errorHandler } from './error/errorHandler';

const router = express.Router();

router.get('/health/live', async (req, res) => {
  logger.info('navigating to /health/live page');
  res.send('Buying Catalogue Admin app is running!');
});

router.get('*', (req, res, next) => next({
  status: 404,
  message: `Incorrect url ${req.originalUrl} - please check it is valid and try again`,
}));

router.use((err, req, res, next) => {
  if (err) {
    const context = errorHandler(err);
    logger.error(context.message);
    return res.render('error/template.njk', context);
  }
  return next();
});

module.exports = router;

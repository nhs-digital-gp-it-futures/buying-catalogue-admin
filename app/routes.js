import express from 'express';
import logger from './logger';
import { errorHandler } from './pages/error/errorHandler';
import { getOrgDashboardContext } from './pages/dashboard/contextCreator';
import { getOrgAccountsContext } from './pages/organisation/controller';
import includesContext from './includes/manifest.json';

const addContext = context => ({
  ...context,
  ...includesContext,
});

const router = express.Router();

router.get('/health/live', async (req, res) => {
  logger.info('navigating to /health/live page');
  res.send('Buying Catalogue Admin app is running!');
});

router.get('/organisations', async (req, res) => {
  logger.info('navigating to organisations page');
  const context = getOrgDashboardContext();
  res.render('pages/dashboard/template.njk', addContext(context));
});

router.get('/organisations/:orgId', async (req, res) => {
  const { orgId } = req.params;
  logger.info(`navigating to organisation: ${orgId} account page`);
  const context = await getOrgAccountsContext(orgId);
  res.render('pages/organisation/template.njk', addContext(context));
});

router.get('*', (req, res, next) => next({
  status: 404,
  message: `Incorrect url ${req.originalUrl} - please check it is valid and try again`,
}));

router.use((err, req, res, next) => {
  if (err) {
    const context = errorHandler(err);
    logger.error(context.message);
    return res.render('pages/error/template.njk', addContext(context));
  }
  return next();
});

module.exports = router;

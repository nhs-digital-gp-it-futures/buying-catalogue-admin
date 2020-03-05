import express from 'express';
import { logger } from './logger';
import { errorHandler } from './pages/error/errorHandler';
import { getOrgAccountsContext } from './pages/organisation/controller';
import { getOrgDashboardContext } from './pages/dashboard/controller';
import { getAddUserContext, postAddUser } from './pages/adduser/controller';
import includesContext from './includes/manifest.json';
import { getAddUserConfirmationContext } from './pages/adduser/confirmation/controller';

const addContext = ({ context, user }) => ({
  ...context,
  ...includesContext,
  username: user && user.name,
});

export const routes = (authProvider) => {
  const router = express.Router();

  router.get('/health/live', async (req, res) => {
    logger.info('navigating to /health/live page');
    res.send('Buying Catalogue Admin app is running!');
  });

  router.get('/login', authProvider.authenticate({
    successReturnToOrRedirect: '/organisations',
  }));

  router.get('/oauth/callback', authProvider.authenticate({
    callback: true,
    successReturnToOrRedirect: '/organisations',
    failureRedirect: '/',
  }));

  router.get('/organisations', async (req, res) => {
    logger.info('navigating to organisations page');
    const context = getOrgDashboardContext();
    res.render('pages/dashboard/template.njk', addContext({ context, user: req.user }));
  });

  router.get('/organisations/:orgId/adduser', async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} add user page`);
    const context = await getAddUserContext(orgId);
    res.render('pages/adduser/template.njk', addContext({ context, user: req.user }));
  });

  router.get('/organisations/:orgId/adduser/confirmation', async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} add user confirmation page`);
    const context = await getAddUserConfirmationContext(orgId);
    res.render('pages/adduser/confirmation/template.njk', addContext({ context, user: req.user }));
  });

  router.post('/organisations/:orgId/adduser', async (req, res) => {
    const { orgId } = req.params;
    const response = await postAddUser({ orgId, data: req.body });

    if (response.success) {
      res.send('Confirmation page');
      // TODO: Uncomment when confirmation page is done
      // return res.redirect('/organisations/:orgId/adduser/success (TBD)');
    }
    // TODO: Implement with errors
    // const context = await getAddUserPageErrorContext({ validationErrors: response (etc) });

    //   return res.render('pages/adduser/template', context);
  });

  router.get('/organisations/:orgId', async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} account page`);
    const context = await getOrgAccountsContext(orgId);
    res.render('pages/organisation/template.njk', addContext({ context, user: req.user }));
  });

  router.get('/organisations/:orgId/adduser', async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} create user page`);
    res.send('create user account');
  });

  router.get('*', (req, res, next) => next({
    status: 404,
    message: `Incorrect url ${req.originalUrl} - please check it is valid and try again`,
  }));

  router.use((err, req, res, next) => {
    if (err) {
      const context = errorHandler(err);
      logger.error(context.message);
      return res.render('pages/error/template.njk', addContext({ context, user: req.user }));
    }
    return next();
  });

  return router;
};

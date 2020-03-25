import express from 'express';
import { logger } from './logger';
import { withCatch, extractAccessToken } from './helpers/routerHelper';
import { errorHandler } from './pages/error/errorHandler';
import { getOrgAccountsContext } from './pages/organisation/controller';
import { getOrgDashboardContext } from './pages/dashboard/controller';
import { getAddUserContext, postAddUser } from './pages/adduser/controller';
import includesContext from './includes/manifest.json';
import { getAddUserConfirmationContext } from './pages/adduser/confirmation/controller';
import config from './config';

const addContext = ({ context, user, csrfToken }) => ({
  ...context,
  ...includesContext,
  config,
  username: user && user.name,
  csrfToken,
});

export const routes = (authProvider) => {
  const router = express.Router();

  router.get('/health/live', async (req, res) => {
    logger.info('navigating to /health/live page');
    res.send('Buying Catalogue Admin app is running!');
  });

  router.get('/login', authProvider.login());

  router.get('/oauth/callback', authProvider.loginCallback());

  router.get('/logout', async (req, res) => {
    const url = await authProvider.logout({ idToken: extractAccessToken({ req, tokenType: 'id' }) });
    res.redirect(url);
  });

  router.get('/signout-callback-oidc', async (req, res) => {
    if (req.logout) req.logout();
    req.session = null;

    if (req.headers.cookie) {
      req.headers.cookie.split(';')
        .map(cookie => cookie.split('=')[0])
        .forEach(cookieKey => res.clearCookie(cookieKey));
    }

    res.redirect(config.logoutRedirectPath);
  });

  router.get('/organisations', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to organisations page');
    const context = await getOrgDashboardContext({ accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/dashboard/template.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/:organisationId', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} account page`);
    const context = await getOrgAccountsContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/organisation/template.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/:organisationId/adduser', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} add user page`);
    const context = await getAddUserContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/adduser/template.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/organisations/:organisationId/adduser', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const response = await postAddUser({ organisationId, data: req.body, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    if (response.success) {
      res.redirect(`/organisations/${organisationId}/adduser/confirmation?userAdded=${response.userAdded}`);
    } else res.send('Error adding user');
    // TODO: Implement with errors
    // const context = await getAddUserPageErrorContext({ validationErrors: response (etc) });
    //   return res.render('pages/adduser/template', context);
  }));

  router.get('/organisations/:organisationId/adduser/confirmation', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const { userAdded } = req.query;
    logger.info(`navigating to organisation: ${organisationId} add user confirmation page`);
    const context = await getAddUserConfirmationContext({ userAdded, organisationId });
    res.render('pages/adduser/confirmation/template.njk', addContext({ context, user: req.user }));
  }));

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

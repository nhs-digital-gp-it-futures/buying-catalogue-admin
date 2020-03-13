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
    const idToken = req.session && req.session.accessToken && req.session.accessToken.id_token;
    const url = await authProvider.logout({ idToken });
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

  router.get('/organisations', withCatch(async (req, res) => {
    logger.info('navigating to organisations page');
    const context = await getOrgDashboardContext({ token: extractAccessToken(req) });
    res.render('pages/dashboard/template.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/:orgId/adduser', withCatch(async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} add user page`);
    const context = await getAddUserContext(orgId);
    res.render('pages/adduser/template.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/organisations/:orgId/adduser', withCatch(async (req, res) => {
    const { orgId } = req.params;
    const response = await postAddUser({ orgId, data: req.body });

    if (response.success) {
      res.redirect(`/organisations/${orgId}/adduser/confirmation`);
    } else res.send('Error adding user');
    // TODO: Implement with errors
    // const context = await getAddUserPageErrorContext({ validationErrors: response (etc) });

    //   return res.render('pages/adduser/template', context);
  }));

  router.get('/organisations/:orgId/adduser/confirmation', withCatch(async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} add user confirmation page`);
    const context = await getAddUserConfirmationContext(orgId);
    res.render('pages/adduser/confirmation/template.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/:orgId', withCatch(async (req, res) => {
    const { orgId } = req.params;
    logger.info(`navigating to organisation: ${orgId} account page`);
    const context = await getOrgAccountsContext(orgId);
    res.render('pages/organisation/template.njk', addContext({ context, user: req.user }));
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

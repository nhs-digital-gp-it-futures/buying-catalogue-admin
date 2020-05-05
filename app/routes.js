import express from 'express';
import { ErrorContext, errorHandler, healthRoutes } from 'buying-catalogue-library';
import { logger } from './logger';
import { withCatch, extractAccessToken, getHealthCheckDependencies } from './helpers/routerHelper';
import { getOrgAccountsContext } from './pages/organisation/controller';
import { getOrgDashboardContext } from './pages/dashboard/controller';
import { getAddUserContext, getAddUserPageErrorContext, postAddUser } from './pages/adduser/controller';
import includesContext from './includes/manifest.json';
import { getAddUserConfirmationContext } from './pages/adduser/confirmation/controller';
import { getViewUserContext, postUserStatus } from './pages/viewuser/controller';
import { getUserStatusContext } from './pages/viewuser/changeUserStatusConfirmation/controller';
import { getEditOrgContext, putUpdateOrganisation } from './pages/editorg/controller';
import { getEditOrgConfirmationContext } from './pages/editorg/confirmation/controller';
import config from './config';
import { newOrgRoutes } from './pages/neworg/routes';

const addContext = ({ context, user, csrfToken }) => ({
  ...context,
  ...includesContext,
  config,
  username: user && user.name,
  csrfToken,
});

export const routes = (authProvider) => {
  const router = express.Router();

  healthRoutes({ router, dependencies: getHealthCheckDependencies(config), logger });

  router.use('/health', healthRoutes);

  router.get('/login', authProvider.login());

  router.get('/oauth/callback', authProvider.loginCallback());

  router.get('/logout', async (req, res) => {
    const url = await authProvider.logout({ req, idToken: extractAccessToken({ req, tokenType: 'id' }) });
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

  router.get('/organisations', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to organisations page');
    const context = await getOrgDashboardContext({ accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/dashboard/template.njk', addContext({ context, user: req.user }));
  }));

  router.use('/organisations/find', newOrgRoutes(authProvider, addContext));

  router.get('/organisations/:organisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} account page`);
    const context = await getOrgAccountsContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/organisation/template.njk', addContext({ context, user: req.user }));
  }));

  router.post('/organisations/:organisationId/edit', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    await putUpdateOrganisation({ organisationId, body: req.body, accessToken });
    logger.info(`redirecting to edit organisation: ${organisationId} confirmation page`);
    res.redirect(`${config.baseUrl}/organisations/${organisationId}/edit/confirmation`);
  }));

  router.get('/organisations/:organisationId/edit', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to edit organisation: ${organisationId} page`);
    const context = await getEditOrgContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/editorg/template.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.get('/organisations/:organisationId/edit/confirmation', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to edit organisation: ${organisationId} confirmation page`);
    const context = await getEditOrgConfirmationContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('common/pages/confirmation.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.get('/organisations/:organisationId/adduser', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} add user page`);
    const context = await getAddUserContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/adduser/template.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/organisations/:organisationId/adduser', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    const response = await postAddUser({ organisationId, data: req.body, accessToken });
    if (response.success) {
      return res.redirect(`${config.baseUrl}/organisations/${organisationId}/adduser/confirmation?id=${response.id}`);
    }
    const context = await getAddUserPageErrorContext({
      validationErrors: response.errors,
      organisationId,
      accessToken,
      data: req.body,
    });
    return res.render('pages/adduser/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.get('/organisations/:organisationId/:userId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId, userId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} edit user: ${userId} page`);
    const context = await getViewUserContext({ organisationId, userId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/viewuser/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.get('/organisations/:organisationId/adduser/confirmation', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const { id: userId } = req.query;
    logger.info(`navigating to organisation: ${organisationId} add user confirmation page`);
    const context = await getAddUserConfirmationContext({ userId, organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/:organisationId/:userId/enable', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { userId, organisationId } = req.params;
    const context = await getUserStatusContext({
      userId, organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }), status: 'enable',
    });
    res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  router.post('/organisations/:organisationId/:userId/enable', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { userId, organisationId } = req.params;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    await postUserStatus({ userId, accessToken, status: 'enable' });
    res.redirect(`${config.baseUrl}/organisations/${organisationId}/${userId}/enable`);
  }));

  router.get('/organisations/:organisationId/:userId/disable', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { userId, organisationId } = req.params;
    const context = await getUserStatusContext({
      userId, organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }), status: 'disable',
    });

    res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  router.post('/organisations/:organisationId/:userId/disable', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { userId, organisationId } = req.params;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    await postUserStatus({ userId, accessToken, status: 'disable' });
    res.redirect(`${config.baseUrl}/organisations/${organisationId}/${userId}/disable`);
  }));

  router.get('*', (req) => {
    throw new ErrorContext({
      status: 404,
      title: `Incorrect url ${req.originalUrl}`,
      description: 'Please check it is valid and try again',
    });
  });

  errorHandler(router, (error, req, res) => {
    logger.error(`${error.title} - ${error.description} ${JSON.stringify(error)}`);
    return res.render('pages/error/template.njk', addContext({ context: error, user: req.user }));
  });

  return router;
};

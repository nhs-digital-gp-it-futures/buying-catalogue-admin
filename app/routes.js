import express from 'express';
import {
  ErrorContext, errorHandler, healthRoutes, authenticationRoutes,
} from 'buying-catalogue-library';
import { logger } from './logger';
import { withCatch, extractAccessToken, getHealthCheckDependencies } from './helpers/routerHelper';
import { getOrgAccountsContext } from './pages/organisation/controller';
import {
  getRelatedOrganisations,
  deleteRelatedOrganisation,
  postRelatedOrganisation,
  getUnrelatedOrganisations,
  getOrganisation,
  validateAddProxyForm,
  formatRelatedOrgsTable,
  formatUnrelatedOrgsRadio,
} from './pages/organisation/proxy/controller';
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

  authenticationRoutes({
    router, authProvider, tokenType: 'id', logoutRedirectPath: config.logoutRedirectPath, logger,
  });

  router.get('/organisations', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to organisations page');
    const context = await getOrgDashboardContext({ accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/dashboard/template.njk', addContext({ context, user: req.user }));
  }));

  router.get('/organisations/proxy/:organisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info('navigating to add proxy page');
    const unrelatedOrgs = await getUnrelatedOrganisations({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    const organisation = await getOrganisation({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });

    res.render('pages/organisation/proxy/add/template.njk', addContext({ context: { organisation, unrelatedOrgsRadio: formatUnrelatedOrgsRadio(unrelatedOrgs) }, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/organisations/proxy/:organisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    const { relatedOrganisationId } = req.body;
    const errors = validateAddProxyForm({ req });
    logger.info('creating related organisation relationship');

    if (errors) {
      const unrelatedOrgs = await getUnrelatedOrganisations({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
      const organisation = await getOrganisation({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
      return res.render('pages/organisation/proxy/add/template.njk', addContext({ context: { organisation, unrelatedOrgsRadio: formatUnrelatedOrgsRadio(unrelatedOrgs), errors }, user: req.user, csrfToken: req.csrfToken() }));
    }

    await postRelatedOrganisation({ relatedOrganisationId, organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.redirect(`${config.baseUrl}/organisations/${organisationId}#related-org-table`);
  }));

  router.get('/organisations/removeproxy/:organisationId/:relatedOrganisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { relatedOrganisationId, organisationId } = req.params;
    logger.info('navigating to remove proxy page');
    const context = {
      organisation: await getOrganisation({ organisationId: relatedOrganisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) }),
      backLinkUrl: `/admin/organisations/${organisationId}`,
    };
    res.render('pages/organisation/proxy/remove/template.njk', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/organisations/removeproxy/:organisationId/:relatedOrganisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId, relatedOrganisationId } = req.params;
    logger.info('removing related organisation relationship');
    await deleteRelatedOrganisation({ organisationId, relatedOrganisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.redirect(`${config.baseUrl}/organisations/${organisationId}#related-org-table`);
  }));

  router.use('/organisations/find', newOrgRoutes(authProvider, addContext));

  router.get('/organisations/:organisationId', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { organisationId } = req.params;
    logger.info(`navigating to organisation: ${organisationId} account page`);
    const context = await getOrgAccountsContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    const rawRelatedOrgs = await getRelatedOrganisations({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    res.render('pages/organisation/template.njk', addContext({ context: { relatedOrgs: formatRelatedOrgsTable(rawRelatedOrgs, organisationId), ...context }, user: req.user }));
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
    const context = {
      ...error,
      isDevelopment: config.isDevelopment(),
    };
    return res.render('pages/error/template.njk', addContext({ context, user: req.user }));
  });

  return router;
};

import express from 'express';
import { logger } from '../../logger';
import { withCatch, extractAccessToken } from '../../helpers/routerHelper';
import { getFindOrgContext, getFindOrgByOds } from './findorg/controller';
import { getSelectOrgContext } from './selectorg/controller';
import { getCreateOrgContext, postAddOrg } from './createorg/controller';
import { getCreateOrgConfirmationContext } from './confirmation/controller';
import { getCreateOrgErrorContext } from './error/controller';
import config from '../../config';

const router = express.Router();

export const newOrgRoutes = (authProvider, addContext) => {
  router.get('/', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { ods: odsCode, error: errorCode } = req.query;
    logger.info('navigating to find organisation page');
    const context = await getFindOrgContext({ odsCode, errorCode });
    return res.render('pages/neworg/findorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { odsCode } = req.body;
    const response = await getFindOrgByOds({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    if (response.success) return res.redirect(`${config.baseUrl}/organisations/find/select?ods=${odsCode}`);
    return res.redirect(`${config.baseUrl}/organisations/find?ods=${odsCode}&error=${response.errorStatus}`);
  }));

  router.get('/select', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const odsCode = req.query.ods;
    logger.info('navigating to select organisation page');
    const context = await getSelectOrgContext({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('pages/neworg/selectorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { odsCode } = req.body;
    return res.redirect(`${config.baseUrl}/organisations/find/select/create?ods=${odsCode}`);
  }));

  router.get('/select/create', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const odsCode = req.query.ods;
    logger.info('navigating to create organisation page');
    const context = await getCreateOrgContext({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('pages/neworg/createorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select/create', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { odsCode } = req.body;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    const response = await postAddOrg({ odsCode, data: req.body, accessToken });
    if (response.success) {
      return res.redirect(`${config.baseUrl}/organisations/find/select/create/confirmation?id=${response.orgId}`);
    }
    return res.redirect(`${config.baseUrl}/organisations/find/select/create/error?ods=${odsCode}&errors=${response.errorsString}`);
  }));

  router.get('/select/create/confirmation', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const organisationId = req.query.id;
    logger.info('navigating to create organisation confirmation page');
    const context = await getCreateOrgConfirmationContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  router.get('/select/create/error', authProvider.authorise({ claim: 'organisation' }), withCatch(authProvider, async (req, res) => {
    const { ods: odsCode, errors: errorsString } = req.query;
    logger.info('navigating to create organisation error page');
    const context = await getCreateOrgErrorContext({ odsCode, errorsString });
    return res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  return router;
};

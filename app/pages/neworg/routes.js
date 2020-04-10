import express from 'express';
import { logger } from '../../logger';
import { withCatch, extractAccessToken } from '../../helpers/routerHelper';
import { getFindOrgContext } from './findorg/controller';
import { getSelectOrgContext } from './selectorg/controller';
import { getCreateOrgContext, postAddOrg } from './createorg/controller';
import { getCreateOrgConfirmationContext } from './confirmation/controller';
import config from '../../config';

const router = express.Router();

export const newOrgRoutes = (authProvider, addContext) => {
  router.get('/', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const odsCode = req.query.ods;
    logger.info('navigating to find organisation page');
    const context = await getFindOrgContext({ odsCode });
    return res.render('pages/neworg/findorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    return res.redirect(`${config.baseUrl}/organisations/find/select?ods=${req.body.odsCode}`);
  }));

  router.get('/select', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const odsCode = req.query.ods;
    logger.info('navigating to select organisation page');
    const context = await getSelectOrgContext({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('pages/neworg/selectorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { odsCode } = req.body;
    return res.redirect(`${config.baseUrl}/organisations/find/select/create?ods=${odsCode}`);
  }));

  router.get('/select/create', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const odsCode = req.query.ods;
    logger.info('navigating to create organisation page');
    const context = await getCreateOrgContext({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('pages/neworg/createorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select/create', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const { odsCode } = req.body;
    const accessToken = extractAccessToken({ req, tokenType: 'access' });
    const response = await postAddOrg({ odsCode, data: req.body, accessToken });
    if (response.success) {
      return res.redirect(`${config.baseUrl}/organisations/find/select/create/confirmation?id=${response.orgId}`);
    }
    // TODO: remove below when validation is complete
    const context = await getCreateOrgContext({ odsCode, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    // const context = await getAddOrgPageErrorContext({
    //   validationErrors: response.errors,
    //   odsCode,
    //   accessToken,
    //   data: req.body,
    // });
    return res.render('pages/neworg/createorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.get('/select/create/confirmation', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    const organisationId = req.query.id;
    logger.info('navigating to create organisation confirmation page');
    const context = await getCreateOrgConfirmationContext({ organisationId, accessToken: extractAccessToken({ req, tokenType: 'access' }) });
    return res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  return router;
};

import express from 'express';
import { logger } from '../../logger';
import { withCatch } from '../../helpers/routerHelper';
import { getFindOrgContext } from './findorg/controller';
import { getSelectOrgContext } from './selectorg/controller';
import { getCreateOrgContext } from './createorg/controller';
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
    res.redirect(`${config.baseUrl}/organisations/find/select`);
  }));

  router.get('/select', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to select organisation page');
    const context = await getSelectOrgContext();
    return res.render('pages/neworg/selectorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    res.redirect(`${config.baseUrl}/organisations/find/select/create`);
  }));

  router.get('/select/create', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to create organisation page');
    const context = await getCreateOrgContext();
    return res.render('pages/neworg/createorg/template', addContext({ context, user: req.user, csrfToken: req.csrfToken() }));
  }));

  router.post('/select/create', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    res.redirect(`${config.baseUrl}/organisations/find/select/create/confirmation`);
  }));

  router.get('/select/create/confirmation', authProvider.authorise(), withCatch(authProvider, async (req, res) => {
    logger.info('navigating to create organisation confirmation page');
    const context = await getCreateOrgConfirmationContext();
    res.render('common/pages/confirmation.njk', addContext({ context, user: req.user }));
  }));

  return router;
};

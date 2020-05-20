const { AuthProvider, ErrorContext } = require('buying-catalogue-library');
const { logger } = require('../logger');

export const createAuthProvider = ({ config }) => {
  const unauthenticatedError = new ErrorContext({
    status: 401,
    title: 'You\'re not authorised to view this page',
    description: 'You must be logged in as an admin user to access Buying Catalogue admin.',
    backLinkHref: config.publicBrowseBaseUrl,
  });
  const authProvider = new AuthProvider({
    config, scopes: 'Organisation', unauthenticatedError, logger,
  });
  return authProvider;
};

import { ErrorContext } from 'buying-catalogue-library';
import { appBaseUri, isDevelopment } from '../config';
import { getEndpoint } from '../endpoints';
import { logger } from '../logger';

export const withCatch = (authProvider, route) => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    if (err.stack) {
      logger.error(`Unexpected Error:\n${err.stack}`);
    }

    if (err instanceof ErrorContext) {
      return next(err);
    }

    if (err.response && err.response.status === 401) {
      req.headers.referer = `${appBaseUri}${req.originalUrl}`;
      return authProvider.login()(req, res, next);
    }

    const stackTrace = isDevelopment() ? err.stack : undefined;
    const defaultError = new ErrorContext({ status: 500, stackTrace });

    return next(defaultError);
  }
};

export const extractAccessToken = ({ req, tokenType }) => req.session
  && req.session.accessToken && req.session.accessToken[`${tokenType}_token`];

export const getHealthCheckDependencies = () => {
  const dependencies = [
    {
      name: 'Identity Server',
      endpoint: getEndpoint({ endpointLocator: 'getIdentityApiHealth' }),
      critical: true,
    },
    {
      name: 'Organisation API',
      endpoint: getEndpoint({ endpointLocator: 'getOrganisationApiHealth' }),
      critical: true,
    },
  ];

  return dependencies;
};

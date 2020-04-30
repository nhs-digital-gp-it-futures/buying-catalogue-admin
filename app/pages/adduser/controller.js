import { ErrorContext, getData, postData } from 'buying-catalogue-library';
import { getContext, getErrorContext } from './contextCreator';
import { getEndpoint } from '../../endpoints';
import { logger } from '../../logger';

export const getAddUserContext = async ({ organisationId, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });
  // Need to call getOrgById to get org name
  const orgData = await getData({ endpoint, accessToken, logger });
  if (orgData) {
    logger.info(`Organisation ${organisationId} returned`);
    return getContext(orgData);
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};

export const getAddUserPageErrorContext = async ({
  organisationId, accessToken, validationErrors, data,
}) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });

  // Need to call getOrgById to get org name
  const orgData = await getData({ endpoint, accessToken, logger });
  if (orgData) {
    logger.info(`Organisation ${organisationId} returned`);
    return getErrorContext({ orgData, validationErrors, data });
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};

export const postAddUser = async ({ organisationId, data, accessToken }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'postAddUser', options: { organisationId } });

    const response = await postData({
      endpoint,
      body: data,
      accessToken,
      logger,
    });

    if (response.data && response.data.errors) {
      logger.info(`Errors returned: ${JSON.stringify(response.data.errors)}`);
      return { success: false, errors: response.data.errors };
    }
    logger.info(`User added: ${JSON.stringify(data)}`);
    return { success: true, id: response.data.userId };
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data) {
      return err.response.data;
    }
    throw new ErrorContext({
      status: err.response.status,
    });
  }
};

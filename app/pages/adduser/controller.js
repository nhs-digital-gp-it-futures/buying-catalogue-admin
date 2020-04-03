import { getData, postData } from '../../apiProvider';
import { getContext, getErrorContext } from './contextCreator';
import { logger } from '../../logger';

export const getAddUserContext = async ({ organisationId, accessToken }) => {
  // Need to call getOrgById to get org name
  const orgData = await getData({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
  if (orgData) {
    logger.info(`Organisation ${organisationId} returned`);
    return getContext(orgData);
  }

  throw new Error('No data returned');
};

export const getAddUserPageErrorContext = async ({
  organisationId, accessToken, validationErrors, data,
}) => {
  // Need to call getOrgById to get org name
  const orgData = await getData({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
  if (orgData) {
    logger.info(`Organisation ${organisationId} returned`);
    return getErrorContext({ orgData, validationErrors, data });
  }

  throw new Error('No data returned');
};

export const postAddUser = async ({ organisationId, data, accessToken }) => {
  try {
    const response = await postData({
      endpointLocator: 'postAddUser',
      options: { organisationId },
      body: data,
      accessToken,
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

    throw new Error(err.response.data);
  }
};

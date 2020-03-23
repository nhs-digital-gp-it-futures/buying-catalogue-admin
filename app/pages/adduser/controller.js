import { getData, postData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getAddUserContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  // Need to call getOrgById to get org name
  const orgData = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  logger.info(`Organisation ${organisationId} returned`);
  return getContext(orgData);
};

export const postAddUser = async ({ organisationId, data, accessToken }) => {
  logger.info(`Organisation ${organisationId} returned`);
  try {
    await postData({
      endpointLocator: 'postAddUser',
      options: { organisationId },
      body: data,
      accessToken,
    });
    logger.info(`User ${JSON.stringify(data)} added`);
    return { success: true };
  } catch (err) {
    if (err.response.status === 400) {
      return err.response.data;
    }
    logger.error(err);
    throw err;
  }
};

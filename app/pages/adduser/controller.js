import { getData, postData } from '../../apiProvider';
import { getContext } from './contextCreator';
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

export const postAddUser = async ({ organisationId, data, accessToken }) => {
  try {
    await postData({
      endpointLocator: 'postAddUser',
      options: { organisationId },
      body: data,
      accessToken,
    });

    logger.info(`User added: ${JSON.stringify(data)}`);
    return { success: true, userAdded: `${data.firstName} ${data.lastName}` };
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data) {
      return err.response.data;
    }
    logger.error(JSON.stringify(err));
    throw new Error(err.response.data || 'Something went wrong');
  }
};

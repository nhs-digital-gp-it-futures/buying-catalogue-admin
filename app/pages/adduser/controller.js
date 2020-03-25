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
    const response = await postData({
      endpointLocator: 'postAddUser',
      options: { organisationId },
      body: data,
      accessToken,
    });
    if (response.errors) {
      return { success: false, errors: response.errors };
    }
    logger.info(`User added: ${JSON.stringify(data)}`);
    return { success: true, userAdded: `${data.firstName} ${data.lastName}` };
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data) {
      return err.response.data;
    }

    throw new Error(err.response.data);
  }
};

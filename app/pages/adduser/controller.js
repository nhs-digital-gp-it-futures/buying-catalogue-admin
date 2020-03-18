// import axios from 'axios'
import { getData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { organisationApiUrl } from '../../config';
import { logger } from '../../logger';

export const getAddUserContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  // Need to call this to get org name
  const orgData = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  logger.info(`Organisation ${organisationId} returned`);
  return getContext(orgData);
};

// TODO: Uncomment when API work is done and remove the implementation above
// export const getAddUserContext = async (organisationId) => {
//   const endpoint = `${organisationApiUrl}/api/v1/Organisations/${organisationId}`;
//   logger.info(`api called: [GET] ${endpoint}`);
//   const response = await axios.get(endpoint);

//   if (response.data) {
//     logger.info(`Organisation ${organisationId} returned`);
//     const { data } = response;
//     return getContext({ data });
//   }

//   throw new Error('No data returned');
// };

export const postAddUser = async ({ organisationId/* , data */ }) => {
  const endpoint = `${organisationApiUrl}/api/v1/Organisations/${organisationId}/Users`;
  logger.info(`Organisation ${organisationId} returned`);
  try {
    logger.info(`api called: [POST] ${endpoint}`);
    // TODO: Uncomment when API work is done
    // await axios.post(endpoint, data);
    return { success: true };
  } catch (err) {
    if (err.response.status === 400) {
      return err.response.data;
    }
    logger.error(err);
    throw err;
  }
};

// import axios from 'axios';
import { getContext } from './contextCreator';
import { identityServer } from '../../config';
import logger from '../../logger';

export const getAddUserContext = (orgId) => {
  const endpoint = `${identityServer}/api/v1/Organisations/${orgId}`;
  logger.info(`api called: [GET] ${endpoint}`);
  logger.info(`Organisation ${orgId} returned`);
  return getContext({ data: {} });
};

// TODO: Uncomment when API work is done and remove the implementation above
// export const getAddUserContext = async (orgId) => {
//   const endpoint = `${identityServer}/api/v1/Organisations/${orgId}`;
//   logger.info(`api called: [GET] ${endpoint}`);
//   const response = await axios.get(endpoint);

//   if (response.data) {
//     logger.info(`Organisation ${orgId} returned`);
//     const { data } = response;
//     return getContext({ data });
//   }

//   throw new Error('No data returned');
// };

export const postAddUser = async ({ orgId/* , data */ }) => {
  const endpoint = `${identityServer}/api/v1/Organisations/${orgId}/Users`;
  logger.info(`Organisation ${orgId} returned`);
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

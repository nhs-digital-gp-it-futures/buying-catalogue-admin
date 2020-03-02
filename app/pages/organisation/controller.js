// import axios from 'axios';
import { getContext } from './contextCreator'
import { identityServer } from '../../config';
import logger from '../../logger';

export const getOrgAccountsContext = (orgId) => {
  const endpoint = `${identityServer}/api/v1/Organisations/${orgId}`;
  logger.info(`api called: [GET] ${endpoint}`);
  logger.info(`Organisation ${orgId} returned`);
  return getContext({ data: {} });
};

// TODO: Uncomment when API work is done and remove the implementation above
// export const getOrgAccountsContext = async (orgId) => {
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

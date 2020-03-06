// import axios from 'axios';
import { getContext } from './contextCreator';
import { identityServer } from '../../config';
import { logger } from '../../logger';

export const getOrgDashboardContext = () => {
  const endpoint = `${identityServer}/api/v1/Organisations`;
  logger.info(`api called: [GET] ${endpoint}`);
  logger.info('Organisations returned');
  return getContext({});
};

// TODO: Uncomment when API work is done and remove the implementation above
// export const getOrgDashboardContext = async () => {
//   const endpoint = `${identityServer}/api/v1/Organisations`;
//   logger.info(`api called: [GET] ${endpoint}`);
//   const response = await axios.get(endpoint);

//   if (response.data) {
//     logger.info('Organisations returned');
//     const { data } = response;
//     return getContext({ data });
//   }

//   throw new Error('No data returned');
// };

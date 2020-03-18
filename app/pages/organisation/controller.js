import { getData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getOrgAccountsContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  const orgData = await getData({ endpointLocator: 'getOrgById', options, accessToken });

  if (orgData) {
    logger.info(`Organisation ${orgData.name} (${organisationId}) returned`);
    const users = await getData({ endpointLocator: 'getUsers', options, accessToken });

    logger.info(`${users.users ? users.users.length : 'No'} users found`);
    orgData.users = users.users;
    return getContext({ organisation: orgData });
  }

  throw new Error(`No organisation data returned for id: ${organisationId}`);
};

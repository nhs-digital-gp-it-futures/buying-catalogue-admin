import { getData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getOrgAccountsContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  const organisation = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    const users = await getData({ endpointLocator: 'getUsers', options, accessToken });
    logger.info(`${users.users ? users.users.length : 'No'} users found`);
    organisation.users = users.users;
    return getContext({ organisation });
  }

  throw new Error(`No organisation data returned for id: ${organisationId}`);
};

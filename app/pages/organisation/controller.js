import { ErrorContext, getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getEndpoint } from '../../endpoints';

export const getOrgAccountsContext = async ({ organisationId, accessToken }) => {
  const getOrgEndpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });
  const organisation = await getData({ endpoint: getOrgEndpoint, accessToken, logger });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    const getUsersEndpoint = getEndpoint({ endpointLocator: 'getUsers', options: { organisationId } });
    const users = await getData({ endpoint: getUsersEndpoint, accessToken, logger });
    logger.info(`${users.users ? users.users.length : 'No'} users found`);
    organisation.users = users.users;
    return getContext({ organisation });
  }
  throw new ErrorContext({
    status: 404,
    description: `No organisation data returned for id: ${organisationId}`,
  });
};

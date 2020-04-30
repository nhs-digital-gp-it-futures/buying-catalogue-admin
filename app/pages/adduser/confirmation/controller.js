import { ErrorContext, getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getAddUserConfirmationContext = async ({ userId, organisationId, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getUserById', options: { userId } });

  const user = await getData({ endpoint, accessToken, logger });
  if (user) {
    logger.info(`User ${user.userId}: ${user.name} found`);
    return getContext({ userAdded: user.name, organisationId });
  }
  throw new ErrorContext({
    status: 404,
    description: `No user data returned for id: ${userId}`,
  });
};

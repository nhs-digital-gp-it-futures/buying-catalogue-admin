import { ErrorContext, getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getUserStatusContext = async ({
  userId, organisationId, accessToken, status,
}) => {
  const endpoint = getEndpoint({ endpointLocator: 'getUserById', options: { userId } });

  const user = await getData({ endpoint, accessToken, logger });
  user.userId = userId;
  if (user) {
    logger.info(`User ${user.userId}: ${user.name} found`);
    return getContext({
      user, status, organisationId,
    });
  }
  throw new ErrorContext({
    status: 404,
    description: `No user data returned for id: ${userId}`,
  });
};

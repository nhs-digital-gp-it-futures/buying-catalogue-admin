import { ErrorContext } from 'buying-catalogue-library';
import { getData } from '../../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';

export const getUserStatusContext = async ({
  userId, organisationId, accessToken, status,
}) => {
  const user = await getData({ endpointLocator: 'getUserById', options: { userId }, accessToken });
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

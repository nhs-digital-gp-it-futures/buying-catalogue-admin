import { getData } from '../../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';

export const getAddUserConfirmationContext = async ({ userId, organisationId, accessToken }) => {
  const user = await getData({ endpointLocator: 'getUserById', options: { userId }, accessToken });
  if (user) {
    logger.info(`User ${user.userId}: ${user.name} found`);
    return getContext({ userAdded: user.name, organisationId });
  }
  throw new Error(`No user data returned for id: ${userId}`);
};

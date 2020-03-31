import { getData, postData } from '../../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';

export const getUserStatusContext = async ({
  userId, organisationId, accessToken, status,
}) => {
  const user = await getData({ endpointLocator: 'getUserById', options: { userId }, accessToken });
  if (user) {
    logger.info(`User ${user.userId}: ${user.name} found`);
    return getContext({
      user, status, organisationId,
    });
  }
  throw new Error(`No user data returned for id: ${userId}`);
};

export const postUserStatus = async ({ userId, status, accessToken }) => {
  try {
    await postData({ endpointLocator: 'postUserStatus', options: { userId, status }, accessToken });

    logger.info(`User ${userId} status updated to: ${status}`);
    return { success: true };
  } catch (err) {
    throw new Error(`Unable to update status for user id: ${userId}`);
  }
};

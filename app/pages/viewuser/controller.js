import { getData, postData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getEndpoint } from '../../endpoints';

export const getViewUserContext = async ({ organisationId, userId, accessToken }) => {
  const userEndpoint = getEndpoint({ endpointLocator: 'getUserById', options: { userId } });
  const user = await getData({ endpoint: userEndpoint, accessToken, logger });
  if (user) {
    const orgEndpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });
    logger.info(`User ${userId}: ${user.name} found`);
    const organisation = await getData({ endpoint: orgEndpoint, accessToken, logger });
    logger.info(`Organisation ${organisationId}: ${organisation.name} returned`);
    user.organisationName = organisation.name;
    user.organisationId = organisationId;
    user.userId = userId;
    return getContext({ user });
  }
  logger.error(`No user data returned for id: ${userId}`);
  throw new Error();
};

export const postUserStatus = async ({ userId, accessToken, status }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'postUserStatus', options: { userId, status } });

    await postData({ endpoint, accessToken, logger });

    logger.info(`User ${userId} status updated to: ${status}`);
    return { success: true };
  } catch (err) {
    logger.error(`Unable to update status for user id: ${userId}`);
    throw new Error();
  }
};

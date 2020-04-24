import { ErrorContext } from 'buying-catalogue-library';
import { getData, postData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getViewUserContext = async ({ organisationId, userId, accessToken }) => {
  const user = await getData({ endpointLocator: 'getUserById', options: { userId }, accessToken });
  if (user) {
    logger.info(`User ${userId}: ${user.name} found`);
    const organisation = await getData({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
    logger.info(`Organisation ${organisationId}: ${organisation.name} returned`);
    user.organisationName = organisation.name;
    user.organisationId = organisationId;
    user.userId = userId;
    return getContext({ user });
  }
  throw new ErrorContext({
    status: 404,
    description: `No user data returned for id: ${userId}`,
  });
};

export const postUserStatus = async ({ userId, accessToken, status }) => {
  try {
    await postData({ endpointLocator: 'postUserStatus', options: { userId, status }, accessToken });

    logger.info(`User ${userId} status updated to: ${status}`);
    return { success: true };
  } catch (err) {
    throw new ErrorContext({
      description: `Unable to update status for user id: ${userId}`,
    });
  }
};

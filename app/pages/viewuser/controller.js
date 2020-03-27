import { getData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getViewUserContext = async ({ organisationId, userId, accessToken }) => {
  const user = {
    name: 'John Smith',
    phonenumber: '0123465',
    emailaddress: 'John.Smith@address.com',
    disabled: false,
    primaryorganisationid: 'ASKT5-FO0L3',
  };
  // const user = await getData({ endpointLocator: 'getUserById', options: { userId }, accessToken });
  if (user) {
    logger.info(`User ${userId}: ${user.name} found`);
    const organisation = await getData({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
    logger.info(`Organisation ${organisationId}: ${organisation.name} returned`);
    user.organisationName = organisation.name;
    user.organisationId = organisationId;
    return getContext({ user });
  }

  throw new Error(`No user data returned for id: ${userId}`);
};

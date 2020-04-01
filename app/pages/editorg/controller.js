import { getData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getEditOrgAccountContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  const organisation = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return getContext({ organisation });
  }

  throw new Error(`No organisation data returned for id: ${organisationId}`);
};

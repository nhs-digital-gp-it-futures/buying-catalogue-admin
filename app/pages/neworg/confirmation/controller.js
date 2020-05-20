import { getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getCreateOrgConfirmationContext = async ({ organisationId, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });

  const org = await getData({ endpoint, accessToken, logger });
  if (org) {
    logger.info(`Organisation ${organisationId}: ${org.name} found`);
    return getContext({ orgName: org.name });
  }
  logger.error(`No organisation data returned for id: ${organisationId}`);
  throw new Error();
};

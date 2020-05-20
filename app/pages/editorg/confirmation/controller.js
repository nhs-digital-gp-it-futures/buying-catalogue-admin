import { getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getEditOrgConfirmationContext = async ({ organisationId, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });

  const organisation = await getData({ endpoint, accessToken, logger });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return getContext({ organisationName: organisation.name, organisationId });
  }
  logger.error(`No organisation data returned for id: ${organisationId}`);
  throw new Error();
};

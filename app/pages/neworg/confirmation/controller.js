import { ErrorContext } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getData } from '../../../apiProvider';

export const getCreateOrgConfirmationContext = async ({ organisationId, accessToken }) => {
  const org = await getData({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
  if (org) {
    logger.info(`Organisation ${organisationId}: ${org.name} found`);
    return getContext({ orgName: org.name });
  }
  throw new ErrorContext({
    status: 404,
    description: `No organisation data returned for id: ${organisationId}`,
  });
};

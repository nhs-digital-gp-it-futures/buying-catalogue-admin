import { getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getSelectOrgContext = async ({ odsCode, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgByOdsCode', options: { odsCode } });
  const org = await getData({ endpoint, accessToken, logger });
  if (org) {
    logger.info(`Organisation with ${odsCode}: ${org.organisationName} found`);
    return getContext({ orgData: org });
  }
  logger.error(`No organisation data returned for odsCode: ${odsCode}`);
  throw new Error();
};

import { getContext } from './contextCreator';
import { getData } from '../../../apiProvider';
import { logger } from '../../../logger';

export const getSelectOrgContext = async ({ odsCode, accessToken }) => {
  const org = await getData({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });
  if (org) {
    logger.info(`Organisation with ${odsCode}: ${org.organisationName} found`);
    return getContext({ orgData: org });
  }
  throw new Error(`No organisation data returned for odsCode: ${odsCode}`);
};

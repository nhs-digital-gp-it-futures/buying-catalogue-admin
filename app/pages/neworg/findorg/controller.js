import { getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { getEndpoint } from '../../../endpoints';
import { logger } from '../../../logger';

export const getFindOrgContext = params => getContext(params);

export const getFindOrgByOds = async ({ odsCode, accessToken }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getOrgByOdsCode', options: { odsCode } });

    await getData({ endpoint, accessToken, logger });

    return { success: true };
  } catch (err) {
    if (err.response.status === 404 || err.response.status === 406) {
      return { success: false, errorStatus: err.response.status };
    }
    logger.error(`Error finding organisation data for odsCode: ${odsCode}`);
    throw new Error();
  }
};

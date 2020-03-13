import axios from 'axios';
import { getContext } from './contextCreator';
import { organisationApiUrl } from '../../config';
import { logger } from '../../logger';

export const getOrgDashboardContext = async ({ token }) => {
  const endpoint = `${organisationApiUrl}/api/v1/Organisations`;
  logger.info(`api called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
  if (response.data) {
    logger.info('Organisations returned');
    const { data } = response;
    return getContext({ data });
  }

  throw new Error('No organisations data returned');
};

import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getData } from '../../apiProvider';

export const getOrgDashboardContext = async ({ accessToken }) => {
  const data = await getData({ endpointLocator: 'getOrganisations', accessToken });

  if (data) {
    logger.info('Organisations returned');
    return getContext({ data });
  }

  throw new Error('No organisations data returned');
};

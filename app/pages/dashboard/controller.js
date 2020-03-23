import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getData } from '../../apiProvider';

export const getOrgDashboardContext = async ({ accessToken }) => {
  const organisations = await getData({ endpointLocator: 'getOrganisations', accessToken });
  if (organisations) {
    logger.info('Organisations returned');
    return getContext({ organisations: organisations.organisations });
  }

  throw new Error('No organisations data returned');
};

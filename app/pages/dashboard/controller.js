import { ErrorContext, getData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { getEndpoint } from '../../endpoints';
import { logger } from '../../logger';

export const getOrgDashboardContext = async ({ accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrganisations' });

  const organisations = await getData({ endpoint, accessToken, logger });
  if (organisations) {
    logger.info('Organisations returned');
    return getContext({ organisations: organisations.organisations });
  }

  throw new ErrorContext({
    status: 404,
    description: 'No organisations data returned',
  });
};

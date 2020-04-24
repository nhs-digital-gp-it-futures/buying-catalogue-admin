import { ErrorContext } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getData } from '../../apiProvider';

export const getOrgDashboardContext = async ({ accessToken }) => {
  const organisations = await getData({ endpointLocator: 'getOrganisations', accessToken });
  if (organisations) {
    logger.info('Organisations returned');
    return getContext({ organisations: organisations.organisations });
  }
  throw new ErrorContext({
    status: 404,
    description: 'No organisations data returned',
  });
};

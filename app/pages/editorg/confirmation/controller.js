import { getContext } from './contextCreator';
import { getData } from '../../../apiProvider';
import { logger } from '../../../logger';

export const getEditOrgConfirmationContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  const organisation = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return getContext({ organisationName: organisation.name, organisationId });
  }

  throw new Error(`No organisation data returned for id: ${organisationId}`);
};

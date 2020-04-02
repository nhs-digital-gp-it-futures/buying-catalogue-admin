import { getData, putData } from '../../apiProvider';
import { getContext } from './contextCreator';
import { logger } from '../../logger';

export const getEditOrgAccountContext = async ({ organisationId, accessToken }) => {
  const options = { organisationId };
  const organisation = await getData({ endpointLocator: 'getOrgById', options, accessToken });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return getContext({ organisation });
  }

  throw new Error(`No organisation data returned for id: ${organisationId}`);
};

export const putUpdateOrganisation = async ({ organisationId, body, accessToken }) => {
  const data = {
    ...body,
    catalogueagreementsigned: !!body.catalogueagreementsigned,
  };

  await putData({
    endpointLocator: 'putUpdateOrganisation',
    options: { organisationId },
    body: data,
    accessToken,
  });

  // eslint-disable-next-line no-underscore-dangle
  delete data._csrf;
  logger.info(`Organisation updated: ${JSON.stringify(data)}`);
  return { success: true };
};

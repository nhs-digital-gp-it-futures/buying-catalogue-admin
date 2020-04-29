import { ErrorContext, getData, putData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../logger';
import { getEndpoint } from '../../endpoints';

export const getEditOrgContext = async ({ organisationId, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } });

  const organisation = await getData({ endpoint, accessToken, logger });
  if (organisation) {
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return getContext({ organisation });
  }
  throw new ErrorContext({
    status: 404,
    description: `No organisation data returned for id: ${organisationId}`,
  });
};

export const putUpdateOrganisation = async ({ organisationId, body, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'putUpdateOrganisation', options: { organisationId } });

  const data = {
    ...body,
    catalogueAgreementSigned: !!body.catalogueAgreementSigned,
  };

  await putData({
    endpoint,
    body: data,
    accessToken,
    logger,
  });

  // eslint-disable-next-line no-underscore-dangle
  delete data._csrf;
  logger.info(`Organisation updated: ${JSON.stringify(data)}`);
  return { success: true };
};

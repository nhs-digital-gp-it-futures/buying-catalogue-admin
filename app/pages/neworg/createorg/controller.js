import { getData, postData } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getCreateOrgContext = async ({ odsCode, accessToken }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getOrgByOdsCode', options: { odsCode } });

  const org = await getData({ endpoint, accessToken, logger });
  if (org) {
    logger.info(`Organisation with ${odsCode}: ${org.organisationName} found`);
    return getContext({ orgData: org });
  }
  logger.error(`No organisation data returned for odsCode: ${odsCode}`);
  throw new Error();
};

export const postAddOrg = async ({ odsCode, data, accessToken }) => {
  try {
    const orgEndpoint = getEndpoint({ endpointLocator: 'getOrgByOdsCode', options: { odsCode } });
    const orgData = await getData({ endpoint: orgEndpoint, accessToken, logger });
    const postOrgEndpoint = getEndpoint({ endpointLocator: 'postAddOrg' });

    const response = await postData({
      endpoint: postOrgEndpoint,
      body: {
        ...orgData,
        catalogueAgreementSigned: !!data.catalogueAgreementSigned,
      },
      accessToken,
      logger,
    });

    logger.info(`Organisation added: ${JSON.stringify(data)}`);
    return { success: true, orgId: response.data.organisationId };
  } catch (err) {
    if (err.response.status === 400 && err.response.data && err.response.data.errors) {
      logger.info(`Errors returned: ${JSON.stringify(err.response.data.errors)}`);
      const errorsString = err.response.data.errors
        ? err.response.data.errors.reduce((arr, error) => {
          arr.push(error.id);
          return arr;
        }, []).join('%')
        : undefined;
      return { success: false, errorsString };
    }
    logger.error(`Error adding organisation for odsCode: ${odsCode}`);
    throw new Error();
  }
};

import { getContext } from './contextCreator';
import { getData, postData } from '../../../apiProvider';
import { logger } from '../../../logger';

export const getCreateOrgContext = async ({ odsCode, accessToken }) => {
  const org = await getData({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });
  if (org) {
    logger.info(`Organisation with ${odsCode}: ${org.organisationName} found`);
    return getContext({ orgData: org });
  }
  throw new Error(`No organisation data returned for odsCode: ${odsCode}`);
};

export const postAddOrg = async ({ odsCode, data, accessToken }) => {
  try {
    const orgData = await getData({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });
    const response = await postData({
      endpointLocator: 'postAddOrg',
      body: {
        ...orgData,
        catalogueAgreementSigned: !!data.catalogueAgreementSigned,
      },
      accessToken,
    });

    if (response.data && response.data.errors) {
      logger.info(`Errors returned: ${JSON.stringify(response.data.errors)}`);
      return { success: false, errors: response.data.errors };
    }
    logger.info(`Organisation added: ${JSON.stringify(data)}`);
    return { success: true, orgId: response.data.organisationId };
  } catch (err) {
    throw new Error(err.response.data);
  }
};

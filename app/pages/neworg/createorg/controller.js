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
      const errorsString = response.data.errors
        ? response.data.errors.reduce((arr, error) => {
          arr.push(error.id);
          return arr;
        }, []).join('+')
        : undefined;
      return { success: false, errorsString };
    }
    logger.info(`Organisation added: ${JSON.stringify(data)}`);
    return { success: true, orgId: response.data.id };
  } catch (err) {
    throw new Error(err.response);
  }
};

import {
  getData,
  postData,
  deleteData,
  ErrorContext,
} from 'buying-catalogue-library';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getUnrelatedOrganisations = async ({ organisationId, accessToken }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getUnrelatedOrgs', options: { organisationId } });
    const unrelatedOrgs = await getData({ endpoint, accessToken, logger });
    logger.info(`Unrelated organisations for ${organisationId} returned`);
    return unrelatedOrgs;
  } catch (err) {
    const errorString = `Error finding unrelated organisation data for id ${organisationId}`;
    logger.error(errorString);
    throw new ErrorContext({
      status: err.response.status,
      description: errorString,
      stackTrace: err.stack,
      data: err.response.data,
    });
  }
};

export const getOrganisation = async ({ organisationId, accessToken }) => {
  try {
    const organisation = await getData({ endpoint: getEndpoint({ endpointLocator: 'getOrgById', options: { organisationId } }), accessToken, logger });
    logger.info(`Organisation ${organisation.name} (${organisationId}) returned`);
    return organisation;
  } catch (err) {
    const errorString = `No organisation data returned for id ${organisationId}`;
    logger.error(errorString);
    throw new ErrorContext({
      status: err.response.status,
      description: errorString,
      stackTrace: err.stack,
      data: err.response.data,
    });
  }
};

export const getRelatedOrganisations = async ({ organisationId, accessToken }) => {
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getRelatedOrgs', options: { organisationId } });
    const relatedOrgs = await getData({ endpoint, accessToken, logger });
    logger.info(`Related organisation for id ${organisationId} returned`);
    return relatedOrgs;
  } catch (err) {
    const errorString = `Error finding related organisation data for id ${organisationId}`;
    logger.error(errorString);
    throw new ErrorContext({
      status: err.response.status,
      description: errorString,
      stackTrace: err.stack,
      data: err.response.data,
    });
  }
};

export const deleteRelatedOrganisation = async (
  { organisationId, relatedOrganisationId, accessToken },
) => {
  try {
    await deleteData({
      endpoint: getEndpoint({ endpointLocator: 'deleteRelatedOrg', options: { organisationId, relatedOrganisationId } }),
      accessToken,
      logger,
    });
    logger.info(`Relationship removed between organisations ${organisationId} and ${relatedOrganisationId}`);
    return { organisationId, relatedOrganisationId };
  } catch (err) {
    const errorString = `Error removing relationship between organisations ${organisationId} and ${relatedOrganisationId}`;
    logger.error(errorString);
    throw new ErrorContext({
      status: err.response.status,
      description: errorString,
      stackTrace: err.stack,
      data: err.response.data,
    });
  }
};

export const postRelatedOrganisation = async (
  { organisationId, relatedOrganisationId, accessToken },
) => {
  try {
    await postData({
      endpoint: getEndpoint({ endpointLocator: 'postAddRelatedOrg', options: { organisationId } }),
      body: {
        relatedOrganisationId,
      },
      accessToken,
      logger,
    });
    logger.info(`Relationship created between organisations ${organisationId} and ${relatedOrganisationId}`);
    return { organisationId, relatedOrganisationId };
  } catch (err) {
    const errorString = `Error creating relationship between organisations ${organisationId} and ${relatedOrganisationId}`;
    logger.error(errorString);
    throw new ErrorContext({
      status: err.response.status,
      description: errorString,
      stackTrace: err.stack,
      data: err.response.data,
    });
  }
};

export const validateAddProxyForm = ({ req }) => {
  const { relatedOrganisationId } = req.body;
  const errors = {};
  if (!relatedOrganisationId) {
    errors.message = 'Select one option.';
    errors.errorList = [{
      text: 'Select the organisation you are looking for',
      href: '#relatedOrganisationId',
    }];
  }
  return Object.keys(errors).length ? errors : false;
};

export const formatUnrelatedOrgsRadio = (unrelatedOrgs) => unrelatedOrgs.map((item) => (
  { value: item.organisationId, text: item.name }
));

export const formatRelatedOrgsTable = (rawRelatedOrgs, organisationId) => rawRelatedOrgs.map(
  (item) => ([
    {
      data: item.name,
      dataTestId: `related-org-name-${item.organisationId}`,
    },
    {
      data: item.odsCode,
      dataTestId: `related-org-odsCode-${item.organisationId}`,
    },
    {
      href: `/admin/organisations/removeproxy/${organisationId}/${item.organisationId}`,
      data: 'Remove',
      dataTestId: `related-org-remove-${item.organisationId}`,
    },
  ]),
);

import axios from 'axios';
import { organisationApiUrl } from './config';
import { logger } from './logger';

const endpoints = {
  // GET endpoints
  getOrganisations: () => `${organisationApiUrl}/api/v1/Organisations`,
  getOrgById: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}`,
  getUsers: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}/users`,
};

const getHeaders = accessToken => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

export const getData = async ({ endpointLocator, options, accessToken }) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, getHeaders(accessToken));
  return response.data || null;
};

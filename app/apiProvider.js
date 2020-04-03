import axios from 'axios';
import { organisationApiUrl, oidcBaseUri } from './config';
import { logger } from './logger';

const endpoints = {
  // GET endpoints
  getIdentityApiHealth: () => `${oidcBaseUri}/health/ready`,
  getOrganisations: () => `${organisationApiUrl}/api/v1/Organisations`,
  getOrgById: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}`,
  getUsers: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}/Users`,
  getUserById: options => `${organisationApiUrl}/api/v1/Users/${options.userId}`,
  // POST endpoints
  postAddUser: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}/Users`,
  postUserStatus: options => `${organisationApiUrl}/api/v1/Users/${options.userId}/${options.status}`,
  // PUT endpoins
  putUpdateOrganisation: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}`,
};

const getHeaders = accessToken => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

export const getData = async ({ endpointLocator, options, accessToken }) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, getHeaders(accessToken));
  return response.data || null;
};

export const postData = async ({
  endpointLocator, options, body = {}, accessToken,
}) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [POST] ${endpoint}: ${JSON.stringify(body)}`);
  return axios.post(endpoint, body, getHeaders(accessToken));
};

export const putData = async ({
  endpointLocator, options, body = {}, accessToken,
}) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(body)}`);
  await axios.put(endpoint, body, getHeaders(accessToken));
  return true;
};

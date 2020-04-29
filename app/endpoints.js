import { identityServerUrl, organisationApiUrl, oidcBaseUri } from './config';

const endpoints = {
  // GET endpoints
  getIdentityApiHealth: () => `${oidcBaseUri}/health/ready`,

  getOrganisations: () => `${organisationApiUrl}/api/v1/Organisations`,
  getOrgById: opts => `${organisationApiUrl}/api/v1/Organisations/${opts.organisationId}`,
  getOrgByOdsCode: opts => `${organisationApiUrl}/api/v1/ods/${opts.odsCode}`,

  getUsers: opts => `${identityServerUrl}/api/v1/Organisations/${opts.organisationId}/Users`,
  getUserById: opts => `${identityServerUrl}/api/v1/Users/${opts.userId}`,

  // POST endpoints
  postAddOrg: () => `${organisationApiUrl}/api/v1/Organisations`,

  postAddUser: opts => `${identityServerUrl}/api/v1/Organisations/${opts.organisationId}/Users`,
  postUserStatus: opts => `${identityServerUrl}/api/v1/Users/${opts.userId}/${opts.status}`,

  // PUT endpoins
  putUpdateOrganisation: opts => `${organisationApiUrl}/api/v1/Organisations/${opts.organisationId}`,
};

export const getEndpoint = ({ endpointLocator, options }) => endpoints[endpointLocator](options);

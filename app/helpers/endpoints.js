import { organisationApiUrl } from '../config';

export const endpoints = {
  getOrganisations: () => `${organisationApiUrl}/api/v1/Organisations`,
  getOrgById: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}`,
  getUsers: options => `${organisationApiUrl}/api/v1/Organisations/${options.organisationId}/users`,
};

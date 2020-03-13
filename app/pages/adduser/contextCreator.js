import manifest from './manifest.json';

export const getContext = data => ({
  ...manifest,
  orgId: data.organisationId,
  orgName: data.name,
  submitActionUrl: `/organisations/${data.organisationId}/adduser`,
});
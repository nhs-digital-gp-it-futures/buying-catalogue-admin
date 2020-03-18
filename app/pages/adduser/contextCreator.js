import manifest from './manifest.json';

export const getContext = data => ({
  ...manifest,
  organisationId: data.organisationId,
  organisationName: data.name,
  submitActionUrl: `/organisations/${data.organisationId}/adduser`,
});

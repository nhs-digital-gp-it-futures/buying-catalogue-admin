import manifest from './manifest.json';

export const getContext = data => ({
  ...manifest,
  organisationId: data.organisationId,
  organisationName: data.name,
});

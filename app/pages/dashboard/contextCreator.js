import manifest from './manifest.json';

export const getOrgDashboardContext = data => ({
  ...manifest,
  data: data ? data.map(row => [row.name || '', row.odsCode || '']) : [],
});

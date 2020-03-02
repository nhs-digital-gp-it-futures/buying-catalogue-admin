import manifest from './manifest.json';

export const getOrgDashboardContext = data => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  organisations: data
    ? data.map(row => [
      { data: row.name || '', href: row.orgId ? `organisations/${row.orgId}` : '#' },
      { data: row.odsCode || '' },
    ])
    : [],
});

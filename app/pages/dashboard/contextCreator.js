import manifest from './manifest.json';

// const data = [{ orgId: 'org1', name: 'Greater Manchester CCG', odsCode: 'X01' }, { orgId: 'org2', name: 'Hampshire CCG', odsCode: 'X02' }];

export const getOrgDashboardContext = data => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  data: data
    ? data.map(row => [
      { data: row.name || '', href: row.orgId ? `organisations/${row.orgId}` : '#' },
      { data: row.odsCode || '' },
    ])
    : [],
});

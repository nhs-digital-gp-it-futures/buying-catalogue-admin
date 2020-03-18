import manifest from './manifest.json';

export const getContext = ({ organisations }) => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  organisations: organisations
    ? organisations.map(row => [
      { data: row.name || '', href: row.organisationId ? `organisations/${row.organisationId}` : '#' },
      { data: row.odsCode || '' },
    ])
    : [],
});

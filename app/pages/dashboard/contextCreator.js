import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = ({ organisations }) => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  organisations: organisations
    ? organisations.map(row => [
      { data: row.name || '', href: row.organisationId ? `organisations/${row.organisationId}` : '#' },
      { data: row.odsCode || '' },
    ])
    : [],
  backLinkHref: `${baseUrl}/`,
});

import { baseUrl } from '../../config';
import manifest from './manifest.json';

export const getContext = ({ organisations }) => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  organisations: organisations
    ? organisations.map(row => [
      {
        data: row.name || '',
        href: row.organisationId ? `${baseUrl}/organisations/${row.organisationId}` : '#',
        dataTestId: `org-name-${row.organisationId}`,
      },
      {
        data: row.odsCode || '',
        dataTestId: `ods-code-${row.organisationId}`,
      },
    ])
    : [],
  addOrgButtonHref: `${baseUrl}/organisations/find`,
});

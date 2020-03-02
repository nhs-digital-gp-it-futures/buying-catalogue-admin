import manifest from './manifest.json';

export const getContext = ({ data }) => ({
  ...manifest,
  orgId: data.organisationId,
  orgName: data.name,
  odsCode: data.odsCode,
  primaryRoleId: data.primaryRoleId,
  address: data.address ? data.address.split(',') : [],
  agreementSigned: data.isCatalogueAgreementSigned,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  users: data && data.users ? data.users.map(row => [
    { data: row.name || '', href: '#' || '#' },
    { data: row.telephone || '' },
    { data: row.email || '' },
    {
      tag: row.isDisabled ? {
        dataTestId: `account-disabled-tag-${row.userId}`,
        classes: 'bc-c-tag-outline nhsuk-u-font-size-16',
        text: 'ACCOUNT DISABLED',
      } : false,
    },
  ]) : [],
});

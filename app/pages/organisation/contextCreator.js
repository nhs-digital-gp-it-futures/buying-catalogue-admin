import manifest from './manifest.json';

export const getContext = ({ data }) => ({
  ...manifest,
  organisationId: data.organisationId,
  organisationName: data.name,
  odsCode: data.odsCode,
  primaryRoleId: data.primaryRoleId,
  address: data.address ? data.address.split(',') : [],
  agreementSigned: data.isCatalogueAgreementSigned,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  addUserButtonHref: `/organisations/${data.organisationId}/adduser`,
  users: data && data.users ? data.users.map(row => [
    {
      data: `${(`${row.firstName ? row.firstName : ''} ${row.lastName ? row.lastName : ''}`).trim()}` || '',
      href: '#' || '#',
    },
    { data: row.phoneNumber || '' },
    { data: row.emailAddress || '' },
    {
      tag: row.isDisabled ? {
        dataTestId: `account-disabled-tag-${row.userId}`,
        classes: 'bc-c-tag-outline nhsuk-u-font-size-16',
        text: 'ACCOUNT DISABLED',
      } : false,
    },
  ]) : [],
});

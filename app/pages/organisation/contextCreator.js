import manifest from './manifest.json';

export const getContext = ({ organisation }) => ({
  ...manifest,
  organisationId: organisation.organisationId,
  organisationName: organisation.name,
  odsCode: organisation.odsCode,
  primaryRoleId: organisation.primaryRoleId,
  address: organisation.address ? organisation.address.split(',') : [],
  agreementSigned: organisation.isCatalogueAgreementSigned,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  addUserButtonHref: 'adduser',
  users: organisation && organisation.users ? organisation.users.map(row => [
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

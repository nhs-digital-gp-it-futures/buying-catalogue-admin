import manifest from './manifest.json';
import { baseUrl } from '../../config';
import { extractObjectValuesToArray } from '../../helpers/contextCreatorHelper';

export const getContext = ({ organisation }) => ({
  ...manifest,
  organisationId: organisation.organisationId,
  organisationName: organisation.name,
  odsCode: organisation.odsCode,
  primaryRoleId: organisation.primaryRoleId,
  address: organisation.address ? extractObjectValuesToArray(organisation.address) : [],
  agreementSigned: organisation.catalogueAgreementSigned,
  columnInfo: manifest.columnInfo ? manifest.columnInfo : [],
  addUserButtonHref: `/organisations/${organisation.organisationId}/adduser`,
  users: organisation && organisation.users ? organisation.users.map(row => [
    {
      data: `${(`${row.firstName ? row.firstName : ''} ${row.lastName ? row.lastName : ''}`).trim()}` || '',
      href: `/organisations/${organisation.organisationId}/${row.userId}`,
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
  backLinkHref: `${baseUrl}/organisations`,
  editOrgButtonHref: `/organisations/${organisation.organisationId}/edit`,
});

import { baseUrl } from '../../config';
import { extractObjectValuesToArray } from '../../helpers/contextCreatorHelper';

export const getContext = ({ organisation }) => ({
  organisationId: organisation.organisationId,
  organisationName: organisation.name,
  odsCode: organisation.odsCode,
  primaryRoleId: organisation.primaryRoleId,
  address: organisation.address ? extractObjectValuesToArray(organisation.address) : [],
  agreementSigned: organisation.catalogueAgreementSigned,
  addUserButtonHref: `${baseUrl}/organisations/${organisation.organisationId}/adduser`,
  users: organisation && organisation.users ? organisation.users.map((row) => [
    {
      data: `${(`${row.firstName ? row.firstName : ''} ${row.lastName ? row.lastName : ''}`).trim()}` || '',
      href: `${baseUrl}/organisations/${organisation.organisationId}/${row.userId}`,
      dataTestId: `user-name-${row.userId}`,
    },
    {
      data: row.phoneNumber || '',
      dataTestId: `user-phone-${row.userId}`,
    },
    {
      data: row.emailAddress || '',
      dataTestId: `user-email-${row.userId}`,
    },
    {
      tag: row.isDisabled ? {
        dataTestId: `account-disabled-tag-${row.userId}`,
        classes: 'bc-c-tag-outline nhsuk-u-font-size-16',
        text: 'ACCOUNT DISABLED',
      } : false,
    },
  ]) : [],
  backLinkHref: `${baseUrl}/organisations`,
  editOrgButtonHref: `${baseUrl}/organisations/${organisation.organisationId}/edit`,
});

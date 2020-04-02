import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = ({ user }) => ({
  ...manifest,
  organisationName: user.organisationName,
  userName: user.name,
  phoneNumber: user.phoneNumber,
  emailAddress: user.emailAddress,
  accountDisabled: user.disabled,
  backLinkHref: `${baseUrl}/organisations/${user.organisationId}`,
  editUserButtonHref: '#',
  changeAccountStatusButtonText: `${user.disabled ? 'Re-enable' : 'Disable'} account`,
  changeAccountStatusFormAction: `/organisations/${user.organisationId}/${user.userId}/${user.disabled ? 'enable' : 'disable'}`,
});

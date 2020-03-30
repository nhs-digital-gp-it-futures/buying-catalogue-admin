import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = ({ user }) => ({
  ...manifest,
  organisationName: user.organisationName,
  userName: user.name,
  phoneNumber: user.phonenumber,
  emailAddress: user.emailaddress,
  accountDisabled: user.disabled,
  backLinkHref: `${baseUrl}/organisations/${user.organisationId}`,
  editUserButtonHref: '#',
  disableAccountButtonText: `${user.disabled ? 'Re-enable' : 'Disable'} account`,
  disableFormAction: `/organisations/${user.organisationId}/${user.userId}/${user.disabled ? 'enable' : 'disable'}`,
});

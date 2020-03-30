import manifest from './manifest.json';
import { baseUrl } from '../../../config';

export const getContext = ({
  user, organisationId = 1, status,
}) => ({
  ...manifest[status],
  title: `${user.name}${manifest[status].title}`,
  backLinkHref: `${baseUrl}/organisations/${organisationId}/${user.userId}`,
});

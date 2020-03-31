import manifest from './manifest.json';
import { addParamsToManifest } from '../../../common/helpers/addParamsToManifest';
import { baseUrl } from '../../../config';

export const getContext = ({
  user, organisationId, status,
}) => ({
  ...addParamsToManifest(manifest[status], { userName: user.name }),
  backLinkHref: `${baseUrl}/organisations/${organisationId}/${user.userId}`,
});

import manifest from './manifest.json';
import { addParamsToManifest } from '../../../helpers/contextCreatorHelper';
import { baseUrl } from '../../../config';

export const getContext = ({ userAdded, organisationId }) => ({
  ...addParamsToManifest(manifest, { userAdded }),
  backLinkHref: `${baseUrl}/organisations/${organisationId}`,
});

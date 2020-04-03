import { addParamsToManifest } from '../../../helpers/contextCreatorHelper';
import manifest from './manifest.json';
import { baseUrl } from '../../../config';

export const getContext = ({ orgName, organisationId }) => ({
  ...addParamsToManifest(manifest, { orgName }),
  backLinkHref: `${baseUrl}/organisations/${organisationId}`,
});

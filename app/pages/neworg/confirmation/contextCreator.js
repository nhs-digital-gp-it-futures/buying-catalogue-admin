import manifest from './manifest.json';
import { addParamsToManifest } from '../../../helpers/contextCreatorHelper';
import { baseUrl } from '../../../config';

export const getContext = ({ orgName }) => ({
  ...addParamsToManifest(manifest, { orgName }),
  backLinkHref: `${baseUrl}/organisations`,
});

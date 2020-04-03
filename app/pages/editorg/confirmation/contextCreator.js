import { addParamsToManifest } from '../../../helpers/contextCreatorHelper';
import manifest from './manifest.json';
import { baseUrl } from '../../../config';

export const getContext = ({ organisationName, organisationId }) => ({
  ...addParamsToManifest(manifest, { organisationName }),
  backLinkHref: `${baseUrl}/organisations/${organisationId}`,
});

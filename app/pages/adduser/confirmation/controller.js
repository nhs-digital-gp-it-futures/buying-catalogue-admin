import manifest from './manifest.json';
import { addParamsToManifest } from '../../../common/helpers/addParamsToManifest';
import { baseUrl } from '../../../config';

export const getAddUserConfirmationContext = ({ userAdded, organisationId }) => ({
  ...addParamsToManifest(manifest, {
    userAdded,
    organisationId,
  }),
  backLinkHref: `${baseUrl}/organisations/${organisationId}`,
});

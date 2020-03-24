import manifest from './manifest.json';
import { addParamsToManifest } from '../../../common/helpers/addParamsToManifest';

export const getAddUserConfirmationContext = ({ params, organisationId }) => ({
  ...addParamsToManifest(manifest, {
    userAdded: params.userAdded,
    organisationId,
  }),
});

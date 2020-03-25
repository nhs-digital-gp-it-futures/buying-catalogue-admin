import manifest from './manifest.json';
import { addParamsToManifest } from '../../../common/helpers/addParamsToManifest';

export const getAddUserConfirmationContext = ({ userAdded, organisationId }) => ({
  ...addParamsToManifest(manifest, {
    userAdded,
    organisationId,
  }),
});

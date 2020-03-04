import manifest from './manifest.json';
import { addParamsToManifest } from '../../../common/helpers/addParamsToManifest';

export const getAddUserConfirmationContext = () => ({
  ...addParamsToManifest(manifest, {
    username: 'aNewUser',
  }),
});

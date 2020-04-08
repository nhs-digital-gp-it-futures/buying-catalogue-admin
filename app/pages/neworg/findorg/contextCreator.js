import manifest from './manifest.json';
import { baseUrl } from '../../../config';

export const getContext = () => ({
  ...manifest,
  backLinkHref: `${baseUrl}/organisations`,
});

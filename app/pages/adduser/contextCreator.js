import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = data => ({
  ...manifest,
  organisationId: data.organisationId,
  organisationName: data.name,
  backLinkHref: `${baseUrl}/organisations/${data.organisationId}`,
});

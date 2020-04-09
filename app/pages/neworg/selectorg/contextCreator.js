import manifest from './manifest.json';
import { baseUrl } from '../../../config';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';
// TODO: remove import below when api is hooked up
import mockOrgDetails from '../organisationDetails.json';

export const getContext = () => ({
  ...manifest,
  ...mockOrgDetails,
  address: mockOrgDetails.address ? extractObjectValuesToArray(mockOrgDetails.address) : [],
  backLinkHref: `${baseUrl}/organisations/find?ods=${mockOrgDetails.odsCode}`,
});

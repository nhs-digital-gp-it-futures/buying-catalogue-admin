import manifest from './manifest.json';
import { baseUrl } from '../../../config';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';
// TODO: remove import below when api is hooked up
import mockOrgDetails from '../../../test-utils/fixtures/organisationDetails.json';

export const getContext = () => ({
  ...manifest,
  ...mockOrgDetails,
  address: mockOrgDetails.address ? extractObjectValuesToArray(mockOrgDetails.address) : [],
  backLinkHref: `${baseUrl}/organisations/find/select?ods=${mockOrgDetails.odsCode}`,
});

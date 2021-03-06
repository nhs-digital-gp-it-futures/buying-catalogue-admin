import manifest from './manifest.json';
import { baseUrl } from '../../../config';
import { extractObjectValuesToArray } from '../../../helpers/contextCreatorHelper';

export const getContext = ({ orgData }) => ({
  ...manifest,
  ...orgData,
  address: orgData.address ? extractObjectValuesToArray(orgData.address) : [],
  backLinkHref: `${baseUrl}/organisations/find?ods=${orgData.odsCode}`,
});

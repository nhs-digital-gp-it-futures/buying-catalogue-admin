import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const getErrorMessage = ({ errorsString, odsCode }) => (errorsString.split('%').includes('OrganisationAlreadyExists')
  ? `The organisation with ODS code ${odsCode} already exists.` : 'Something went wrong.');

export const getContext = (params) => ({
  ...manifest,
  description: getErrorMessage(params),
  backLinkHref: `${baseUrl}/organisations/find`,
});

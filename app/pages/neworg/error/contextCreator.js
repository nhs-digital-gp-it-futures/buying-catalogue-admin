import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const getErrorMessage = (errors, odsCode) => (errors.includes('OrganisationAlreadyExists')
  ? `The organisation with ODS code ${odsCode} already exists.` : 'Something went wrong.');

export const getContext = ({ errors, odsCode }) => ({
  ...manifest,
  errorMessage: getErrorMessage(errors, odsCode),
  backLinkHref: `${baseUrl}/organisations/find`,
});

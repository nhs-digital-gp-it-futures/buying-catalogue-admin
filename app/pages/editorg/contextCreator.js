import manifest from './manifest.json';
import { baseUrl } from '../../config';
import { transformObjectValuesToArray } from '../../helpers/contextCreatorHelper';

export const getContext = ({ organisation }) => ({
  ...manifest,
  organisationName: organisation.name,
  odsCode: organisation.odsCode,
  primaryRoleId: organisation.primaryRoleId,
  address: organisation.address ? transformObjectValuesToArray(organisation.address) : [],
  agreementSigned: organisation.catalogueAgreementSigned,
  backLinkHref: `${baseUrl}/organisations/${organisation.organisationId}`,
  saveCatalogueAgreementPostAction: `${baseUrl}/organisations/${organisation.organisationId}`,
});

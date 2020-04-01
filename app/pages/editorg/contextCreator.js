import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = ({ organisation }) => ({
  ...manifest,
  organisationName: organisation.name,
  odsCode: organisation.odsCode,
  primaryRoleId: organisation.primaryRoleId,
  address: organisation.address ? Object.keys(organisation.address).reduce((acc, key) => {
    if (organisation.address[key]) acc.push(organisation.address[key]);
    return acc;
  }, []) : [],
  agreementSigned: organisation.catalogueAgreementSigned,
  backLinkHref: `${baseUrl}/organisations/${organisation.organisationId}`,
  saveCatalogueAgreementPostAction: `${baseUrl}/organisations/${organisation.organisationId}`,
});

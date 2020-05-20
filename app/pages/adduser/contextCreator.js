import { formatErrors, formatAllErrors, addErrorsAndDataToManifest } from 'buying-catalogue-library';
import manifest from './manifest.json';
import { baseUrl } from '../../config';

export const getContext = orgData => ({
  ...manifest,
  organisationId: orgData.organisationId,
  organisationName: orgData.name,
  backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
});

export const getErrorContext = ({ orgData, validationErrors, data }) => {
  const formattedErrors = formatErrors({ manifest, errors: validationErrors });
  const modifiedManifest = addErrorsAndDataToManifest({ manifest, errors: formattedErrors, data });
  const allErrors = formatAllErrors(modifiedManifest.questions);

  return {
    ...modifiedManifest,
    organisationId: orgData.organisationId,
    organisationName: orgData.name,
    errors: allErrors,
    backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
  };
};

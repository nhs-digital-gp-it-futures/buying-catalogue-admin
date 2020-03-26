import manifest from './manifest.json';
import { baseUrl } from '../../config';
import { formatErrors, formatAllErrors, addErrorsToManifest } from './contextCreatorErrorHelper';

export const getContext = orgData => ({
  ...manifest,
  organisationId: orgData.organisationId,
  organisationName: orgData.name,
  backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
});

export const getErrorContext = ({ orgData, validationErrors }) => {
  const formattedErrors = formatErrors(validationErrors);
  const manifestWithErrors = addErrorsToManifest(formattedErrors);
  const allErrors = formatAllErrors(manifestWithErrors.questions);

  return {
    ...manifestWithErrors,
    organisationId: orgData.organisationId,
    organisationName: orgData.name,
    errors: allErrors,
    backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
  };
};

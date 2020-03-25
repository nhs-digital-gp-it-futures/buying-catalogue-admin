import manifest from './manifest.json';
import { baseUrl } from '../../config';
import { formatErrors, formatAllErrors, addErrorsToManifest } from './contextCreatorErrorHelper';

export const getContext = orgData => ({
  ...manifest,
  organisationId: orgData.organisationId,
  organisationName: orgData.name,
  backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
});

const validationErrorsDefault = [
  {
    field: 'firstName',
    id: 'FirstNameRequired',
  },
  {
    field: 'firstName',
    id: 'FirstNameTooLong',
  },
  {
    field: 'lastName',
    id: 'LastNameRequired',
  },
  {
    field: 'lastName',
    id: 'LastNameTooLong',
  },
  {
    field: 'emailAddress',
    id: 'EmailRequired',
  },
  {
    field: 'emailAddress',
    id: 'EmailTooLong',
  },
  {
    field: 'emailAddress',
    id: 'EmailInvalidFormat',
  },
  {
    field: 'emailAddress',
    id: 'EmailAlreadyExists',
  },
  {
    field: 'phoneNumber',
    id: 'PhoneNumberRequired',
  },
];

export const getErrorContext = ({ orgData, validationErrors = validationErrorsDefault }) => {
  const formattedErrors = formatErrors(validationErrors);
  const allErrors = formatAllErrors(formattedErrors);
  const manifestWithErrors = addErrorsToManifest({ manifest, errors: formattedErrors });

  return {
    ...manifestWithErrors,
    organisationId: orgData.organisationId,
    organisationName: orgData.name,
    errors: allErrors,
    backLinkHref: `${baseUrl}/organisations/${orgData.organisationId}`,
  };
};

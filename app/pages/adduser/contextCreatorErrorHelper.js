import { errorMessages } from './errorStrings';

export const formatErrors = errors => errors.reduce((acc, error) => {
  const errorMessageLocator = `${error.field[0].toLowerCase()}${error.field.slice(1)}`;
  if (acc[errorMessageLocator]) acc[errorMessageLocator].push(errorMessages[error.id]);
  else acc[errorMessageLocator] = [errorMessages[error.id]];
  return acc;
}, {});

export const addErrorsToManifest = ({ manifest, errors }) => {
  const questionsWithErrors = manifest.questions.map((question) => {
    const questionWithErrors = { ...question };
    if (errors[`${question.id[0].toLowerCase()}${question.id.slice(1)}`]) {
      questionWithErrors.error = {
        message: errors[`${question.id[0].toLowerCase()}${question.id.slice(1)}`].join(', '),
      };
    }
    return questionWithErrors;
  });
  return { ...manifest, questions: [...questionsWithErrors] };
};

export const formatAllErrors = errors => Object.keys(errors).reduce(
  (acc, question) => [
    ...acc,
    ...errors[question].map(error => ({
      text: error,
      href: `#${question}`,
    })),
  ], [],
);

import manifest from './manifest.json';

export const formatErrors = errors => errors.reduce((acc, error) => {
  const errorMessageLocator = `${error.field[0].toLowerCase()}${error.field.slice(1)}`;
  if (acc[errorMessageLocator]) acc[errorMessageLocator].push(manifest.errorMessages[error.id]);
  else acc[errorMessageLocator] = [manifest.errorMessages[error.id]];
  return acc;
}, {});

export const addErrorsToManifest = errors => ({
  ...manifest,
  questions: manifest.questions.map(question => (errors[question.id] ? {
    ...question,
    error: { message: errors[question.id].join(', ') },
  } : question)),
});

export const formatAllErrors = questionsWithErrors => questionsWithErrors.reduce(
  (acc, question) => {
    if (question.error) {
      question.error.message.split(', ').forEach((errorString) => {
        acc.push({
          text: errorString,
          href: `#${question.id}`,
        });
      });
    }
    return acc;
  }, [],
);

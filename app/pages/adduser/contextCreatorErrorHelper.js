export const formatErrors = ({ manifest, errors }) => errors.reduce((acc, error) => {
  const errorMessageLocator = `${error.field[0].toLowerCase()}${error.field.slice(1)}`;
  if (acc[errorMessageLocator]) acc[errorMessageLocator].push(manifest.errorMessages[error.id]);
  else acc[errorMessageLocator] = [manifest.errorMessages[error.id]];
  return acc;
}, {});

export const addErrorsAndDataToManifest = ({ manifest, errors, data }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const modifiedQuestion = { ...question };
    if (errors[question.id]) modifiedQuestion.error = { message: errors[question.id].join(', ') };
    if (data && data[question.id]) modifiedQuestion.data = data[question.id];
    return modifiedQuestion;
  }),
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

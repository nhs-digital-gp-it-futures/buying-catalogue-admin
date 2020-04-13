import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const getErrors = ({ error, errors }) => {
  let message = 'Something went wrong';
  if (error === '404') message = 'Not found';
  if (error === '406') message = 'Not a buyer org';
  errors.split('+').forEach((errId) => {
    if (errId === 'OrganisationAlreadyExists') message = 'Org already exists';
  });
  return { message };
};

export const getContext = ({ odsCode, error, errors }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const questionWithData = { ...question };
    if (odsCode && question.id === 'odsCode') questionWithData.data = odsCode;
    if (error || errors) questionWithData.error = getErrors({ error, errors });
    return questionWithData;
  }),
  backLinkHref: `${baseUrl}/organisations`,
});

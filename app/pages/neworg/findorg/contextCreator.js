import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const getErrorMessage = ({ errorCode }) => {
  let message;
  if (errorCode === '404') message = 'Organisation not found';
  if (errorCode === '406') message = 'Not a buyer organisation';
  return message;
};

export const getContext = ({ odsCode, errorCode }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const questionWithData = { ...question };
    if (odsCode && question.id === 'odsCode') questionWithData.data = odsCode;
    if (errorCode) questionWithData.error = { message: getErrorMessage({ errorCode }) };
    return questionWithData;
  }),
  errors: errorCode ? [{ href: '#odsCode', text: getErrorMessage({ errorCode }) }] : undefined,
  backLinkHref: `${baseUrl}/organisations`,
});

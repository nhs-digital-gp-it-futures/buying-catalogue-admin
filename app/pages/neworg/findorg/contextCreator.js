import manifest from './manifest.json';
import { baseUrl } from '../../../config';

const errorMessages = {
  404: 'Organisation not found',
  406: 'Not a buyer organisation',
};

export const getContext = ({ odsCode, errorCode }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const questionWithData = { ...question };
    if (odsCode && question.id === 'odsCode') questionWithData.data = odsCode;
    if (errorCode) questionWithData.error = { message: errorMessages[errorCode] || 'Something went wrong' };
    return questionWithData;
  }),
  errors: errorCode ? [{ href: '#odsCode', text: errorMessages[errorCode] || 'Something went wrong' }] : undefined,
  backLinkHref: `${baseUrl}/organisations`,
});

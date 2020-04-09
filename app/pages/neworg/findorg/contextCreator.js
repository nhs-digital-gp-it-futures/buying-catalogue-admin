import manifest from './manifest.json';
import { baseUrl } from '../../../config';

export const getContext = ({ odsCode }) => ({
  ...manifest,
  questions: manifest.questions.map((question) => {
    const questionWithData = { ...question };
    if (odsCode && question.id === 'odsCode') questionWithData.data = odsCode;
    return questionWithData;
  }),
  backLinkHref: `${baseUrl}/organisations`,
});

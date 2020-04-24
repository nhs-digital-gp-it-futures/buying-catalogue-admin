import { ErrorContext } from 'buying-catalogue-library';
import { getContext } from './contextCreator';
import { getData } from '../../../apiProvider';

export const getFindOrgContext = params => getContext(params);

export const getFindOrgByOds = async ({ odsCode, accessToken }) => {
  try {
    await getData({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });

    return { success: true };
  } catch (err) {
    if (err.response.status === 404 || err.response.status === 406) {
      return { success: false, errorStatus: err.response.status };
    }
    throw new ErrorContext({
      status: err.response.status,
    });
  }
};

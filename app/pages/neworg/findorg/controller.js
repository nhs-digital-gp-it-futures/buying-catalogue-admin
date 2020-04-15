import { getContext } from './contextCreator';
import { getData } from '../../../apiProvider';

export const getFindOrgContext = params => getContext(params);

export const getFindOrgByOds = async ({ odsCode, accessToken }) => {
  try {
    await getData({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });

    return { success: true };
  } catch (err) {
    if (err.status === 404 || err.status === 406) {
      return { success: false, errorStatus: err.status };
    }
    throw new Error(err);
  }
};

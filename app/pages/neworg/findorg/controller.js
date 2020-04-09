import { getContext } from './contextCreator';

export const getFindOrgContext = async ({ odsCode }) => getContext({ odsCode });

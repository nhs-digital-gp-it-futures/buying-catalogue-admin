import { getContext } from './contextCreator';
// TODO: uncomment when API done
// import { getData } from '../../../apiProvider';
// import { logger } from '../../../logger';

// export const getCreateOrgConfirmationContext = async
// ({ organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085', accessToken }) => {
//   const org = await getData({
// endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
//   if (org) {
//     logger.info(`Organisation ${organisationId}: ${org.name} found`);
//     return getContext({ orgName: org.name });
//   }
//   throw new Error(`No orgnisation data returned for id: ${organisationId}`);
// };
const orgName = 'An org name (to be changed)';

export const getCreateOrgConfirmationContext = async () => getContext({ orgName });

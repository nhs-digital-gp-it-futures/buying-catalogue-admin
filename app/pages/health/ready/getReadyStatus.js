import { getData } from 'buying-catalogue-library';
import { status } from '../status';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getReadyStatus = async () => {
  let identityApi;
  try {
    const endpoint = getEndpoint({ endpointLocator: 'getIdentityApiHealth' });
    identityApi = await getData({ endpoint, logger });
  } catch (e) {
    identityApi = status.unhealthy.message;
  }

  const isHealthy = healthcheckResponse => healthcheckResponse === status.healthy.message;
  const isUnhealthy = healthcheckResponse => healthcheckResponse === status.unhealthy.message;

  if (isHealthy(identityApi)) {
    return status.healthy;
  }

  if (isUnhealthy(identityApi)) {
    return status.unhealthy;
  }

  return status.degraded;
};

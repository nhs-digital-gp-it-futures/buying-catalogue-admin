import { getData } from '../../../apiProvider';
import { status } from '../status';

export async function getReadyStatus() {
  let identityApi;
  try {
    identityApi = await getData({ endpointLocator: 'getIdentityApiHealth' });
  } catch (e) {
    identityApi = status.unhealthy.message;
  }

  const isHealthy = Api => Api === status.healthy.message;
  const isUnhealthy = Api => Api === status.unhealthy.message;

  if (isHealthy(identityApi)) {
    return status.healthy;
  }

  if (isUnhealthy(identityApi)) {
    return status.unhealthy;
  }

  return status.degraded;
}

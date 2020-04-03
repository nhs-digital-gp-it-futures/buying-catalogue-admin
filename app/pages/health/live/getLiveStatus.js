import { status } from '../status';

export async function getLiveStatus() {
  return status.healthy;
}

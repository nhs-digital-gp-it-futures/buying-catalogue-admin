import { status } from '../status';
import { getLiveStatus } from './getLiveStatus';

describe('getLiveStatus', () => {
  it('should return \'Healthy\' when app is running', async () => {
    const liveStatus = await getLiveStatus();
    expect(liveStatus).toBe(status.healthy);
  });
});

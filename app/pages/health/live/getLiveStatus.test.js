import { status } from '../status';
import { getLiveStatus } from './getLiveStatus';

describe('getLiveStatus', () => {
  it('should return \'Healthy\' when /health/live is called', () => {
    const liveStatus = getLiveStatus();
    expect(liveStatus).toBe(status.healthy);
  });
});

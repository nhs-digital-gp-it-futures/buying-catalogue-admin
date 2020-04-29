import { getData } from 'buying-catalogue-library';
import { status } from '../status';
import { getReadyStatus } from './getReadyStatus';
import { logger } from '../../../logger';
import { identityServerUrl } from '../../../config';


jest.mock('buying-catalogue-library');

describe('getReadyStatus', () => {
  afterEach(() => {
    getData.mockReset();
  });

  it('should call getData once with the correct params', async () => {
    await getReadyStatus();
    expect(getData.mock.calls.length).toEqual(1);
    expect(getData).toHaveBeenNthCalledWith(1, { endpoint: `${identityServerUrl}/health/ready`, logger });
  });

  it('should return "Healthy" when IdentityApi is "Healthy"', async () => {
    getData
      .mockReturnValueOnce(status.healthy.message);

    expect(await getReadyStatus()).toBe(status.healthy);
  });

  it('should return "Unhealthy" when IdentityApi is "Unhealthy"', async () => {
    getData
      .mockReturnValueOnce(status.unhealthy.message)
      .mockReturnValueOnce(status.healthy.message);

    expect(await getReadyStatus()).toBe(status.unhealthy);
  });
});

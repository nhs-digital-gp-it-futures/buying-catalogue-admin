import { getData } from 'buying-catalogue-library';
import { getFindOrgByOds } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { organisationApiUrl } from '../../../config';

jest.mock('../../../logger');
jest.mock('buying-catalogue-library');

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

describe('findorg controller', () => {
  describe('getFindOrgByOds', () => {
    const accessToken = 'access_token';
    const odsCode = 'abc';

    afterEach(() => {
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce({});
      await getFindOrgByOds({ odsCode, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/ods/abc`, accessToken, logger });
    });

    it('should return success: true if there is no error in api call', async () => {
      getData
        .mockResolvedValueOnce({});

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response).toEqual({ success: true });
    });

    it('should return errorStatus if api call returns 404 error', async () => {
      getData
        .mockRejectedValueOnce({ response: { status: 404 } });

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response.success).toEqual(false);
      expect(response.errorStatus).toEqual(404);
    });

    it('should return errorStatus if api call returns 406 error', async () => {
      getData
        .mockRejectedValueOnce({ response: { status: 406 } });

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response.success).toEqual(false);
      expect(response.errorStatus).toEqual(406);
    });

    it('should throw if api call returns non 404/406 error', async () => {
      getData
        .mockRejectedValueOnce({ response: { status: 500 } });
      try {
        await getFindOrgByOds({ odsCode, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

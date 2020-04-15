import { getFindOrgByOds } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../logger');
jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

describe('', () => {
  describe('getFindOrgByOds', () => {
    const accessToken = 'access_token';
    const odsCode = 'abc';

    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce({});
      await getFindOrgByOds({ odsCode, accessToken });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });
    });

    it('should return success: true if there is no error in api call', async () => {
      apiProvider.getData
        .mockResolvedValueOnce({});

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response).toEqual({ success: true });
    });

    it('should return errorStatus if api call returns 404 error', async () => {
      apiProvider.getData
        .mockRejectedValueOnce({ status: 404 });

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response.success).toEqual(false);
      expect(response.errorStatus).toEqual(404);
    });

    it('should return errorStatus if api call returns 406 error', async () => {
      apiProvider.getData
        .mockRejectedValueOnce({ status: 406 });

      const response = await getFindOrgByOds({ odsCode, accessToken });

      expect(response.success).toEqual(false);
      expect(response.errorStatus).toEqual(406);
    });

    it('should throw if api call returns non 404/406 error', async () => {
      apiProvider.getData
        .mockRejectedValueOnce({ status: 500 });
      try {
        await getFindOrgByOds({ odsCode, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error({ status: 500 }));
      }
    });
  });
});

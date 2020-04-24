import { ErrorContext } from 'buying-catalogue-library';
import { getSelectOrgContext } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../logger');
jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
  postData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockOrgData = {
  organisationId: 'org1',
  organisationName: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: {
    line1: 'C/O NHS ENGLAND, 1W09, 1ST FLOOR',
    line2: 'QUARRY HOUSE',
    line3: 'QUARRY HILL',
    line4: null,
    town: 'LEEDS',
    county: 'WEST YORKSHIRE',
    postcode: 'LS2 7UE',
    country: 'ENGLAND',
  },
  catalogueAgreementSigned: true,
};

describe('create org confirmation page controller', () => {
  describe('getCreateOrgContext', () => {
    const accessToken = 'access_token';
    const odsCode = 'abc';

    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrgData);
      await getSelectOrgContext({ odsCode, accessToken });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({ endpointLocator: 'getOrgByOdsCode', options: { odsCode }, accessToken });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getSelectOrgContext({ odsCode, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({ orgData: mockOrgData });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();
      try {
        await getSelectOrgContext({ odsCode, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          description: 'No organisation data returned for odsCode: abc',
          status: 404,
        }));
      }
    });
  });
});

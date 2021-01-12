import { getData } from 'buying-catalogue-library';
import { getSelectOrgContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { organisationApiUrl } from '../../../config';

jest.mock('../../../logger');
jest.mock('buying-catalogue-library');

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
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      await getSelectOrgContext({ odsCode, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/ods/abc`, accessToken, logger });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getSelectOrgContext({ odsCode, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({ orgData: mockOrgData });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();
      try {
        await getSelectOrgContext({ odsCode, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

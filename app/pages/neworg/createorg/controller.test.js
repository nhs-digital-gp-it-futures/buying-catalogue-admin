import { ErrorContext, getData, postData } from 'buying-catalogue-library';
import { getCreateOrgContext, postAddOrg } from './controller';
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
      await getCreateOrgContext({ odsCode, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/ods/abc`, accessToken, logger });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getCreateOrgContext({ odsCode, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({ orgData: mockOrgData });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();
      try {
        await getCreateOrgContext({ odsCode, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          status: 404,
          description: 'No organisation data returned for odsCode: abc',
        }));
      }
    });
  });

  describe('postAddOrg', () => {
    const accessToken = 'access_token';
    const odsCode = 'abc';

    afterEach(() => {
      getData.mockReset();
      postData.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      await getCreateOrgContext({ odsCode, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/ods/abc`, accessToken, logger });
    });

    it('should call postData once with the correct params when catalogue agreement is signed', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      postData
        .mockResolvedValueOnce({ data: { id: 'org1' } });

      await postAddOrg({ odsCode, data: { odsCode, catalogueAgreementSigned: 'catalogueAgreementSigned' }, accessToken });

      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/ods/abc`, accessToken, logger });
      expect(postData.mock.calls.length).toEqual(1);
      expect(postData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations`,
        body: {
          ...mockOrgData,
          catalogueAgreementSigned: true,
        },
        accessToken,
        logger,
      });
    });

    it('should return success as true and the orgId if api request is successful', async () => {
      postData
        .mockResolvedValueOnce({ data: { organisationId: 'org1' } });

      const response = await postAddOrg({ odsCode, data: { odsCode }, accessToken });

      expect(response.success).toEqual(true);
      expect(response.orgId).toEqual('org1');
    });

    it('should return success as false with errors if api request is unsuccessful', async () => {
      const mockError = { id: 'error' };
      postData
        .mockRejectedValueOnce({ response: { status: 400, data: { errors: [mockError] } } });

      const response = await postAddOrg({ odsCode, data: { odsCode }, accessToken });
      expect(response.success).toEqual(false);
      expect(response.errorsString).toEqual(mockError.id);
    });

    it('should throw an error if api request is unsuccessful', async () => {
      postData
        .mockRejectedValueOnce({ response: { status: 500, data: '500 response data' } });

      try {
        await postAddOrg({ odsCode, data: { odsCode }, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          status: 500,
        }));
      }
    });
  });
});

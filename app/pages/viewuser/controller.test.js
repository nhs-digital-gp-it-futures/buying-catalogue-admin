import { ErrorContext, getData, postData } from 'buying-catalogue-library';
import { getViewUserContext, postUserStatus } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../logger';
import { identityServerUrl, organisationApiUrl } from '../../config';


jest.mock('buying-catalogue-library');

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockUserData = {
  name: 'Some',
  phonenumber: '07777777777',
  emailaddress: 'some@body.com',
  disabled: false,
};

const mockOrgData = {
  organisationId: 'b7ee5261-43e7-4589-907b-5eef5e98c085',
  name: 'Cheshire and Merseyside Commissioning Hub',
  odsCode: '13Y',
  primaryRoleId: 'RO98',
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
  catalogueAgreementSigned: false,
};

describe('viewuser controller', () => {
  describe('getViewUserContext', () => {
    afterEach(() => {
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData twice with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce(mockOrgData);

      await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });
      expect(getData.mock.calls.length).toEqual(2);
      expect(getData).toHaveBeenNthCalledWith(1, {
        endpoint: `${identityServerUrl}/api/v1/Users/1`,
        accessToken: 'access_token',
        logger,
      });
      expect(getData).toHaveBeenNthCalledWith(2, {
        endpoint: `${organisationApiUrl}/api/v1/Organisations/2`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        user: { ...mockUserData, organisationId: 2, organisationName: mockOrgData.name },
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce()
        .mockResolvedValueOnce(mockOrgData);

      try {
        await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          status: 404,
          description: 'No user data returned for id: 1',
        }));
      }
    });
  });

  describe('postAddUser', () => {
    afterEach(() => {
      postData.mockReset();
    });

    it('should call postUserStatus once with the correct params', async () => {
      postData
        .mockResolvedValueOnce({});

      await postUserStatus({ userId: 'user1', accessToken: 'access_token', status: 'enable' });

      expect(postData.mock.calls.length).toEqual(1);
      expect(postData).toHaveBeenCalledWith({
        endpoint: `${identityServerUrl}/api/v1/Users/user1/enable`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should return true if api request is successful', async () => {
      postData
        .mockResolvedValueOnce({});

      const response = await postUserStatus({ userId: 1, accessToken: 'access_token', status: 'enable' });

      expect(response.success).toEqual(true);
    });

    it('should throw an error if api request is unsuccessful', async () => {
      postData
        .mockRejectedValueOnce({ response: { status: 500 } });

      try {
        await postUserStatus({ userId: 1, accessToken: 'access_token', status: 'enable' });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          description: 'Unable to update status for user id: 1',
        }));
      }
    });
  });
});

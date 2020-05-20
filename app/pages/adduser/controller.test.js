import { getData, postData } from 'buying-catalogue-library';
import { getAddUserContext, getAddUserPageErrorContext, postAddUser } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../logger';
import { identityServerUrl, organisationApiUrl } from '../../config';

jest.mock('buying-catalogue-library');

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
  getErrorContext: jest.fn(),
}));

jest.mock('../../logger');

const mockedAddUserData = {
  organisationId: 'abc-123',
  name: 'Some Community Hub',
  odsCode: '1XY',
  primaryRoleId: 'RO01',
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

describe('adduser controller', () => {
  describe('getAddUserContext', () => {
    afterEach(() => {
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockedAddUserData);

      await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/1`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when organisation data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockedAddUserData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith(mockedAddUserData);
    });

    it('should throw an error when no data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();

      try {
        await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });

  describe('getAddUserPageErrorContext', () => {
    afterEach(() => {
      getData.mockReset();
      contextCreator.getErrorContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockedAddUserData);

      await getAddUserPageErrorContext({ organisationId: 1, accessToken: 'access_token', validationErrors: [] });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/1`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getErrorContext with the correct params when organisation data is returned by the apiProvider', async () => {
      const validationErrors = [];
      const data = {};
      getData
        .mockResolvedValueOnce(mockedAddUserData);
      contextCreator.getErrorContext
        .mockResolvedValueOnce();

      await getAddUserPageErrorContext({
        organisationId: 1, accessToken: 'access_token', validationErrors, data,
      });

      expect(contextCreator.getErrorContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getErrorContext).toHaveBeenCalledWith({
        orgData: mockedAddUserData,
        validationErrors,
        data,
      });
    });

    it('should throw an error when no data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();

      try {
        await getAddUserPageErrorContext({ organisationId: 1, accessToken: 'access_token', validationErrors: [] });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });

  describe('postAddUser', () => {
    afterEach(() => {
      postData.mockReset();
    });

    it('should call postData once with the correct params', async () => {
      postData
        .mockResolvedValueOnce({ data: { userId: 'user1' } });

      await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(postData.mock.calls.length).toEqual(1);
      expect(postData).toHaveBeenCalledWith({
        endpoint: `${identityServerUrl}/api/v1/Organisations/1/Users`,
        body: { firstName: 'SomeName' },
        accessToken: 'access_token',
        logger,
      });
    });

    it('should return true if api request is successful', async () => {
      postData
        .mockResolvedValueOnce({ data: { userId: 'user1' } });

      const response = await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(response.success).toEqual(true);
    });

    it('should return error.respose.data if api request is unsuccessful with 400', async () => {
      postData
        .mockRejectedValueOnce({ response: { status: 400, data: '400 response data' } });

      const response = await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(response).toEqual('400 response data');
    });

    it('should throw an error if api request is unsuccessful with non 400', async () => {
      postData
        .mockRejectedValueOnce({ response: { status: 500, data: '500 response data' } });

      try {
        await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

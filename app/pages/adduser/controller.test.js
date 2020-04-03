import { getAddUserContext, getAddUserPageErrorContext, postAddUser } from './controller';
import * as apiProvider from '../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../apiProvider', () => ({
  getData: jest.fn(),
  postData: jest.fn(),
}));

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
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockedAddUserData);

      await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({
        endpointLocator: 'getOrgById',
        accessToken: 'access_token',
        options: { organisationId: 1 },
      });
    });

    it('should call getContext with the correct params when organisation data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockedAddUserData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith(mockedAddUserData);
    });

    it('should throw an error when no data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getAddUserContext({ organisationId: 1, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });

  describe('getAddUserPageErrorContext', () => {
    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getErrorContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockedAddUserData);

      await getAddUserPageErrorContext({ organisationId: 1, accessToken: 'access_token', validationErrors: [] });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({
        endpointLocator: 'getOrgById',
        accessToken: 'access_token',
        options: { organisationId: 1 },
      });
    });

    it('should call getErrorContext with the correct params when organisation data is returned by the apiProvider', async () => {
      const validationErrors = [];
      const data = {};
      apiProvider.getData
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
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getAddUserPageErrorContext({ organisationId: 1, accessToken: 'access_token', validationErrors: [] });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });

  describe('postAddUser', () => {
    afterEach(() => {
      apiProvider.postData.mockReset();
    });

    it('should call postData once with the correct params', async () => {
      apiProvider.postData
        .mockResolvedValueOnce({ data: { userId: 'user1' } });

      await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(apiProvider.postData.mock.calls.length).toEqual(1);
      expect(apiProvider.postData).toHaveBeenCalledWith({
        endpointLocator: 'postAddUser',
        body: { firstName: 'SomeName' },
        options: {
          organisationId: 1,
        },
        accessToken: 'access_token',
      });
    });

    it('should return true if api request is successful', async () => {
      apiProvider.postData
        .mockResolvedValueOnce({ data: { userId: 'user1' } });

      const response = await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(response.success).toEqual(true);
    });

    it('should return error.respose.data if api request is unsuccessful with 400', async () => {
      apiProvider.postData
        .mockRejectedValueOnce({ response: { status: 400, data: '400 response data' } });

      const response = await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });

      expect(response).toEqual('400 response data');
    });

    it('should throw an error if api request is unsuccessful with non 400', async () => {
      apiProvider.postData
        .mockRejectedValueOnce({ response: { status: 500, data: '500 response data' } });

      try {
        await postAddUser({ organisationId: 1, data: { firstName: 'SomeName' }, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error('500 response data'));
      }
    });
  });
});

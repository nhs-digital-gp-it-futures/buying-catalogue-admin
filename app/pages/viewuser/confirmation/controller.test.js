import { getUserStatusContext, postUserStatus } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
  postData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockUserData = {
  name: 'Some',
  phonenumber: '07777777777',
  emailaddress: 'some@body.com',
  disabled: false,
};

describe('user status controller', () => {
  describe('getUserStatusContext', () => {
    describe('when user is re-enabled', () => {
      afterEach(() => {
        apiProvider.getData.mockReset();
        contextCreator.getContext.mockReset();
      });

      it('should call getData once with the correct params', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        await getUserStatusContext({
          userId: 1, organisationId: 2, accessToken: 'access_token', status: 'enable',
        });
        expect(apiProvider.getData.mock.calls.length).toEqual(1);
        expect(apiProvider.getData).toHaveBeenCalledWith({
          endpointLocator: 'getUserById',
          options: { userId: 1 },
          accessToken: 'access_token',
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        contextCreator.getContext
          .mockResolvedValueOnce();

        await getUserStatusContext({
          userId: 1, organisationId: 2, accessToken: 'access_token', status: 'enable',
        });

        expect(contextCreator.getContext.mock.calls.length).toEqual(1);
        expect(contextCreator.getContext).toHaveBeenCalledWith({
          user: { ...mockUserData }, status: 'enable', organisationId: 2,
        });
      });
    });

    describe('when user is disabled', () => {
      afterEach(() => {
        apiProvider.getData.mockReset();
        contextCreator.getContext.mockReset();
      });

      it('should call getData once with the correct params', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        await getUserStatusContext({
          userId: 1, organisationId: 2, accessToken: 'access_token', status: 'disable',
        });
        expect(apiProvider.getData.mock.calls.length).toEqual(1);
        expect(apiProvider.getData).toHaveBeenCalledWith({
          endpointLocator: 'getUserById',
          options: { userId: 1 },
          accessToken: 'access_token',
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        contextCreator.getContext
          .mockResolvedValueOnce();

        await getUserStatusContext({
          userId: 1, organisationId: 2, accessToken: 'access_token', status: 'disable',
        });

        expect(contextCreator.getContext.mock.calls.length).toEqual(1);
        expect(contextCreator.getContext).toHaveBeenCalledWith({
          user: { ...mockUserData }, status: 'disable', organisationId: 2,
        });
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getUserStatusContext({
          userId: 1, organisationId: 2, accessToken: 'access_token', status: 'disable',
        });
      } catch (err) {
        expect(err).toEqual(new Error('No user data returned for id: 1'));
      }
    });
  });

  describe('postAddUser', () => {
    afterEach(() => {
      apiProvider.postData.mockReset();
    });

    it('should call postUserStatus once with the correct params', async () => {
      apiProvider.postData
        .mockResolvedValueOnce({});

      await postUserStatus({ userId: 1, accessToken: 'access_token', status: 'enable' });

      expect(apiProvider.postData.mock.calls.length).toEqual(1);
      expect(apiProvider.postData).toHaveBeenCalledWith({
        endpointLocator: 'postUserStatus',
        options: {
          userId: 1,
          status: 'enable',
        },
        accessToken: 'access_token',
      });
    });

    it('should return true if api request is successful', async () => {
      apiProvider.postData
        .mockResolvedValueOnce({});

      const response = await postUserStatus({ userId: 1, accessToken: 'access_token', status: 'enable' });

      expect(response.success).toEqual(true);
    });

    it('should throw an error if api request is unsuccessful', async () => {
      apiProvider.postData
        .mockRejectedValueOnce({ response: { status: 500 } });

      try {
        await postUserStatus({ userId: 1, accessToken: 'access_token', status: 'enable' });
      } catch (err) {
        expect(err).toEqual(new Error('Error: Unable to update status for user id: 1'));
      }
    });
  });
});

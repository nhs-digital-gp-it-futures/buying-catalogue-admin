import { getUserStatusContext } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockUserData = {
  userId: 'user1',
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
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'enable',
        });
        expect(apiProvider.getData.mock.calls.length).toEqual(1);
        expect(apiProvider.getData).toHaveBeenCalledWith({
          endpointLocator: 'getUserById',
          options: { userId: 'user1' },
          accessToken: 'access_token',
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        contextCreator.getContext
          .mockResolvedValueOnce();

        await getUserStatusContext({
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'enable',
        });

        expect(contextCreator.getContext.mock.calls.length).toEqual(1);
        expect(contextCreator.getContext).toHaveBeenCalledWith({
          user: { ...mockUserData }, status: 'enable', organisationId: 'org1',
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
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'disable',
        });
        expect(apiProvider.getData.mock.calls.length).toEqual(1);
        expect(apiProvider.getData).toHaveBeenCalledWith({
          endpointLocator: 'getUserById',
          options: { userId: 'user1' },
          accessToken: 'access_token',
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        apiProvider.getData
          .mockResolvedValueOnce(mockUserData);
        contextCreator.getContext
          .mockResolvedValueOnce();

        await getUserStatusContext({
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'disable',
        });

        expect(contextCreator.getContext.mock.calls.length).toEqual(1);
        expect(contextCreator.getContext).toHaveBeenCalledWith({
          user: { ...mockUserData }, status: 'disable', organisationId: 'org1',
        });
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce({});

      try {
        await getUserStatusContext({
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'disable',
        });
      } catch (err) {
        expect(err).toEqual(new Error('No user data returned for id: 1'));
      }
    });
  });
});

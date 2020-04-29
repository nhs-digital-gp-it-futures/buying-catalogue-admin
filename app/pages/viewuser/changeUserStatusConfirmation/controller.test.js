import { getData } from 'buying-catalogue-library';
import { getUserStatusContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { identityServerUrl, organisationApiUrl } from '../../../config';


jest.mock('buying-catalogue-library');

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
        getData.mockReset();
        contextCreator.getContext.mockReset();
      });

      it('should call getData once with the correct params', async () => {
        getData
          .mockResolvedValueOnce(mockUserData);
        await getUserStatusContext({
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'enable',
        });
        expect(getData.mock.calls.length).toEqual(1);
        expect(getData).toHaveBeenCalledWith({
          endpoint: `${identityServerUrl}/api/v1/Users/user1`,
          accessToken: 'access_token',
          logger,
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        getData
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
        getData.mockReset();
        contextCreator.getContext.mockReset();
      });

      it('should call getData once with the correct params', async () => {
        getData
          .mockResolvedValueOnce(mockUserData);
        await getUserStatusContext({
          userId: 'user1', organisationId: 'org1', accessToken: 'access_token', status: 'disable',
        });
        expect(getData.mock.calls.length).toEqual(1);
        expect(getData).toHaveBeenCalledWith({
          endpoint: `${identityServerUrl}/api/v1/Users/user1`,
          accessToken: 'access_token',
          logger,
        });
      });

      it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
        getData
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
      getData
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

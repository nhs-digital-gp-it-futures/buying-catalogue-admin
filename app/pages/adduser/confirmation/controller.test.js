import { ErrorContext } from 'buying-catalogue-library';
import { getAddUserConfirmationContext } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockUserData = {
  name: 'John Smith',
};

describe('add user confirmation page controller', () => {
  describe('getAddUserConfirmationContext', () => {
    const accessToken = 'access_token';
    const organisationId = 'org1';
    const userId = 'user1';

    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockUserData);
      await getAddUserConfirmationContext({ organisationId, userId, accessToken });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({
        endpointLocator: 'getUserById',
        options: { userId },
        accessToken: 'access_token',
      });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockUserData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getAddUserConfirmationContext({ organisationId, userId, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        userAdded: mockUserData.name, organisationId,
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getAddUserConfirmationContext({ organisationId, userId, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          status: 404,
          description: 'No user data returned for id: user1',
        }));
      }
    });
  });
});

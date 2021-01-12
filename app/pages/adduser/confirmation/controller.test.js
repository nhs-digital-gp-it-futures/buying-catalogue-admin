import { getData } from 'buying-catalogue-library';
import { getAddUserConfirmationContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { identityServerUrl } from '../../../config';

jest.mock('buying-catalogue-library');

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
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockUserData);
      await getAddUserConfirmationContext({ organisationId, userId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${identityServerUrl}/api/v1/Users/user1`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      getData
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
      getData
        .mockResolvedValueOnce();

      try {
        await getAddUserConfirmationContext({ organisationId, userId, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

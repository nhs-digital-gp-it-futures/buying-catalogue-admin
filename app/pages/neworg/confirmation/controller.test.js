import { ErrorContext } from 'buying-catalogue-library';
import { getCreateOrgConfirmationContext } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockOrg = {
  name: 'A lovely organisation',
};

describe('create org confirmation page controller', () => {
  describe('getCreateOrgConfirmationContext', () => {
    const accessToken = 'access_token';
    const organisationId = 'org1';

    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrg);
      await getCreateOrgConfirmationContext({ organisationId, accessToken });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({ endpointLocator: 'getOrgById', options: { organisationId }, accessToken });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrg);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getCreateOrgConfirmationContext({ organisationId, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({ orgName: mockOrg.name });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getCreateOrgConfirmationContext({ organisationId, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          status: 404,
          description: 'No organisation data returned for id: org1',
        }));
      }
    });
  });
});

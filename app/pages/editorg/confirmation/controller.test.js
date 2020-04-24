import { ErrorContext } from 'buying-catalogue-library';
import { getEditOrgConfirmationContext } from './controller';
import * as apiProvider from '../../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockOrgData = {
  name: 'a lovely organisation',
};

describe('edit org confirmation page controller', () => {
  describe('getEditOrgConfirmationContext', () => {
    const accessToken = 'access_token';
    const organisationId = 'org1';

    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrgData);
      await getEditOrgConfirmationContext({ organisationId, accessToken });
      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({
        endpointLocator: 'getOrgById',
        options: { organisationId },
        accessToken: 'access_token',
      });
    });

    it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getEditOrgConfirmationContext({ organisationId, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        organisationName: mockOrgData.name, organisationId,
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce();

      try {
        await getEditOrgConfirmationContext({ organisationId, accessToken });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          description: 'No organisation data returned for id: org1',
          status: 404,
        }));
      }
    });
  });
});

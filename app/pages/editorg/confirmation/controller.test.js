import { getData } from 'buying-catalogue-library';
import { getEditOrgConfirmationContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { organisationApiUrl } from '../../../config';

jest.mock('buying-catalogue-library');

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
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrgData);
      await getEditOrgConfirmationContext({ organisationId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/org1`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
      getData
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
      getData
        .mockResolvedValueOnce();

      try {
        await getEditOrgConfirmationContext({ organisationId, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

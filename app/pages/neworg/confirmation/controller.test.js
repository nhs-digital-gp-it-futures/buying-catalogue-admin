import { getData } from 'buying-catalogue-library';
import { getCreateOrgConfirmationContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../../logger';
import { organisationApiUrl } from '../../../config';

jest.mock('buying-catalogue-library');

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
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrg);
      await getCreateOrgConfirmationContext({ organisationId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/Organisations/org1`, accessToken, logger });
    });

    it('should call getContext with the correct params when user data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockOrg);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getCreateOrgConfirmationContext({ organisationId, accessToken });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({ orgName: mockOrg.name });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();

      try {
        await getCreateOrgConfirmationContext({ organisationId, accessToken });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

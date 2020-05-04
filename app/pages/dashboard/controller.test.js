import { getData } from 'buying-catalogue-library';
import { getOrgDashboardContext } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../logger';
import { organisationApiUrl } from '../../config';


jest.mock('buying-catalogue-library');

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockOrganisationsData = {
  organisations: [{
    organisationId: 'b7ee5261-43e7-4589-907b-5eef5e98c085',
    name: 'Cheshire and Merseyside Commissioning Hub',
    odsCode: '13Y',
    primaryRoleId: 'RO98',
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
  }],
};

describe('dashboard controller', () => {
  describe('getAddUserContext', () => {
    afterEach(() => {
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrganisationsData);

      await getOrgDashboardContext({ organisationId: 1, accessToken: 'access_token' });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when organisations data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockOrganisationsData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getOrgDashboardContext({ organisationId: 1, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith(mockOrganisationsData);
    });

    it('should throw an error when no data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();

      try {
        await getOrgDashboardContext({ organisationId: 1, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });
});

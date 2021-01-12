import { getData, putData } from 'buying-catalogue-library';
import { getEditOrgContext, putUpdateOrganisation } from './controller';
import * as contextCreator from './contextCreator';
import { logger } from '../../logger';
import { organisationApiUrl } from '../../config';

jest.mock('buying-catalogue-library');

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockOrganisationData = {
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
};

describe('edit organisation controller', () => {
  describe('getEditOrgContext', () => {
    afterEach(() => {
      getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce(mockOrganisationData);

      await getEditOrgContext({ organisationId: 1, accessToken: 'access_token' });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/1`,
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call getContext with the correct params when organisations and users data is returned by the apiProvider', async () => {
      getData
        .mockResolvedValueOnce(mockOrganisationData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getEditOrgContext({ organisationId: 1, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        organisation: mockOrganisationData,
      });
    });

    it('should throw an error when no organisation data is returned from the apiProvider', async () => {
      getData
        .mockResolvedValueOnce();

      try {
        await getEditOrgContext({ organisationId: 1, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error());
      }
    });
  });

  describe('putUpdateOrganisation', () => {
    afterEach(() => {
      putData.mockReset();
    });

    it('should call putData once with the correct params when catalogueAgreementSigned is in the body', async () => {
      putData
        .mockResolvedValueOnce({});

      await putUpdateOrganisation({ organisationId: 1, body: { catalogueAgreementSigned: 'true' }, accessToken: 'access_token' });

      expect(putData.mock.calls.length).toEqual(1);
      expect(putData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/1`,
        body: { catalogueAgreementSigned: true },
        accessToken: 'access_token',
        logger,
      });
    });

    it('should call putData once with the correct params when catalogueAgreementSigned is not in the body', async () => {
      putData
        .mockResolvedValueOnce({});

      await putUpdateOrganisation({ organisationId: 1, body: {}, accessToken: 'access_token' });

      expect(putData.mock.calls.length).toEqual(1);
      expect(putData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/1`,
        body: { catalogueAgreementSigned: false },
        accessToken: 'access_token',
        logger,
      });
    });

    it('should return true if api request is successful', async () => {
      putData
        .mockResolvedValueOnce({});

      const response = await putUpdateOrganisation({ organisationId: 1, body: { catalogueAgreementSigned: 'true' }, accessToken: 'access_token' });

      expect(response.success).toEqual(true);
    });
  });
});

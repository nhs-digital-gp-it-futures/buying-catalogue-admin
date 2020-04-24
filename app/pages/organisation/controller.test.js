import { ErrorContext } from 'buying-catalogue-library';
import { getOrgAccountsContext } from './controller';
import * as apiProvider from '../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../apiProvider', () => ({
  getData: jest.fn(),
}));

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

const mockUsersData = {
  users: [
    {
      userId: 'c093d9ff-e067-4cbe-b209-8271e13d0623',
      firstName: 'Some',
      lastName: 'Body',
      phoneNumber: '07777777777',
      emailAddress: 'some@body.com',
      isDisabled: false,
    },
  ],
};

describe('organisation controller', () => {
  describe('getOrgAccountsContext', () => {
    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData twice with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrganisationData)
        .mockResolvedValueOnce(mockUsersData);

      await getOrgAccountsContext({ organisationId: 1, accessToken: 'access_token' });
      expect(apiProvider.getData.mock.calls.length).toEqual(2);
      expect(apiProvider.getData).toHaveBeenNthCalledWith(1, {
        endpointLocator: 'getOrgById',
        options: { organisationId: 1 },
        accessToken: 'access_token',
      });
      expect(apiProvider.getData).toHaveBeenNthCalledWith(2, {
        endpointLocator: 'getUsers',
        options: { organisationId: 1 },
        accessToken: 'access_token',
      });
    });

    it('should call getContext with the correct params when organisations and users data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockOrganisationData)
        .mockResolvedValueOnce(mockUsersData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getOrgAccountsContext({ organisationId: 1, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        organisation: { ...mockOrganisationData, ...mockUsersData },
      });
    });

    it('should throw an error when no organisation data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce()
        .mockResolvedValueOnce(mockUsersData);

      try {
        await getOrgAccountsContext({ organisationId: 1, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new ErrorContext({
          description: 'No organisation data returned for id: 1',
          status: 404,
        }));
      }
    });
  });
});

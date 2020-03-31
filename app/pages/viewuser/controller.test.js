import { getViewUserContext } from './controller';
import * as apiProvider from '../../apiProvider';
import * as contextCreator from './contextCreator';

jest.mock('../../apiProvider', () => ({
  getData: jest.fn(),
}));

jest.mock('./contextCreator', () => ({
  getContext: jest.fn(),
}));

const mockUserData = {
  name: 'Some',
  phonenumber: '07777777777',
  emailaddress: 'some@body.com',
  disabled: false,
};

const mockOrgData = {
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

describe('viewuser controller', () => {
  describe('getViewUserContext', () => {
    afterEach(() => {
      apiProvider.getData.mockReset();
      contextCreator.getContext.mockReset();
    });

    it('should call getData twice with the correct params', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce(mockOrgData);

      await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });
      expect(apiProvider.getData.mock.calls.length).toEqual(2);
      expect(apiProvider.getData).toHaveBeenNthCalledWith(1, {
        endpointLocator: 'getUserById',
        options: { userId: 1 },
        accessToken: 'access_token',
      });
      expect(apiProvider.getData).toHaveBeenNthCalledWith(2, {
        endpointLocator: 'getOrgById',
        options: { organisationId: 2 },
        accessToken: 'access_token',
      });
    });

    it('should call getContext with the correct params when user and org data is returned by the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce(mockOrgData);
      contextCreator.getContext
        .mockResolvedValueOnce();

      await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });

      expect(contextCreator.getContext.mock.calls.length).toEqual(1);
      expect(contextCreator.getContext).toHaveBeenCalledWith({
        user: { ...mockUserData, organisationId: 2, organisationName: mockOrgData.name },
      });
    });

    it('should throw an error when no user data is returned from the apiProvider', async () => {
      apiProvider.getData
        .mockResolvedValueOnce()
        .mockResolvedValueOnce(mockOrgData);

      try {
        await getViewUserContext({ userId: 1, organisationId: 2, accessToken: 'access_token' });
      } catch (err) {
        expect(err).toEqual(new Error('No user data returned for id: 1'));
      }
    });
  });
});
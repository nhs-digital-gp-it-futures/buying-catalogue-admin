import { getContext } from './contextCreator';
import { baseUrl } from '../../config';

const mockData = {
  organisationId: 'org1',
  name: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
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
  users: [{
    userId: 'user1',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '07777777777',
    emailAddress: 'john.smith@email.com',
    isDisabled: false,
  }, {
    userId: 'user2',
    firstName: 'Daisy',
    lastName: 'Chain',
    phoneNumber: '07777777778',
    emailAddress: 'daisy.chain@email.com',
    isDisabled: true,
  }],
  catalogueAgreementSigned: true,
};

describe('getOrganisationContext', () => {
  it('should add organisationId, organisationName, odsCode, primaryRoleId, agreementSigned to the context if provided', () => {
    const context = getContext({ organisation: mockData });
    expect(context.organisationId).toEqual(mockData.organisationId);
    expect(context.organisationName).toEqual(mockData.name);
    expect(context.odsCode).toEqual(mockData.odsCode);
    expect(context.primaryRoleId).toEqual(mockData.primaryRoleId);
    expect(context.agreementSigned).toEqual(mockData.catalogueAgreementSigned);
  });

  it('should add addUserButtonHref', () => {
    const { addUserButtonHref } = getContext({ organisation: mockData });
    expect(addUserButtonHref).toEqual(`${baseUrl}/organisations/${mockData.organisationId}/adduser`);
  });

  it('should transform address object into array of data strings if provided', () => {
    const { address } = getContext({ organisation: mockData });
    expect(address).toEqual([
      'C/O NHS ENGLAND, 1W09, 1ST FLOOR',
      'QUARRY HOUSE',
      'QUARRY HILL',
      'LEEDS',
      'WEST YORKSHIRE',
      'LS2 7UE',
      'ENGLAND',
    ]);
  });

  it('should return empty array if address not provided', () => {
    const { address } = getContext({ organisation: {} });
    expect(address).toEqual([]);
  });

  it('should return an empty array for users key if no user data provided', () => {
    const context = getContext({ organisation: {} });
    expect(context.users).toEqual([]);
  });

  it('should transform user data into correct format if all data provided', () => {
    const { users } = getContext({ organisation: mockData });
    expect(users[0][0].data).toEqual(`${mockData.users[0].firstName} ${mockData.users[0].lastName}`);
    expect(users[0][0].href).toEqual(`${baseUrl}/organisations/${mockData.organisationId}/${mockData.users[0].userId}`);
    expect(users[0][1].data).toEqual(mockData.users[0].phoneNumber);
    expect(users[0][2].data).toEqual(mockData.users[0].emailAddress);
    expect(users[0][3].tag).toEqual(false);
    expect(users[1][0].data).toEqual(`${mockData.users[1].firstName} ${mockData.users[1].lastName}`);
    expect(users[1][0].href).toEqual(`${baseUrl}/organisations/${mockData.organisationId}/${mockData.users[1].userId}`);
    expect(users[1][1].data).toEqual(mockData.users[1].phoneNumber);
    expect(users[1][2].data).toEqual(mockData.users[1].emailAddress);
    expect(users[1][3].tag.dataTestId).toEqual(`account-disabled-tag-${mockData.users[1].userId}`);
    expect(users[1][3].tag.classes).toEqual('bc-c-tag-outline nhsuk-u-font-size-16');
    expect(users[1][3].tag.text).toEqual('ACCOUNT DISABLED');
  });

  it('should transform user data into correct format if data provided has missing fields', () => {
    const modifiedMockData = {
      ...mockData,
      users: [{
        userId: 'user1',
        emailAddress: 'john.smith@email.com',
        isDisabled: false,
      }, {
        userId: 'user2',
        firstName: 'Daisy',
        lastName: 'Chain',
        phoneNumber: '07777777778',
      }],
    };

    const { users } = getContext({ organisation: modifiedMockData });
    expect(users[0][0].data).toEqual('');
    expect(users[0][0].href).toEqual(`${baseUrl}/organisations/${modifiedMockData.organisationId}/${modifiedMockData.users[0].userId}`);
    expect(users[0][1].data).toEqual('');
    expect(users[0][2].data).toEqual(mockData.users[0].emailAddress);
    expect(users[0][3].tag).toEqual(false);
    expect(users[1][0].data).toEqual(`${mockData.users[1].firstName} ${mockData.users[1].lastName}`);
    expect(users[1][0].href).toEqual(`${baseUrl}/organisations/${modifiedMockData.organisationId}/${modifiedMockData.users[1].userId}`);
    expect(users[1][1].data).toEqual(mockData.users[1].phoneNumber);
    expect(users[1][2].data).toEqual('');
    expect(users[1][3].tag).toEqual(false);
  });

  it('should construct backLinkHref from the data provided', () => {
    const context = getContext({ organisation: mockData });
    expect(context.backLinkHref).toEqual(`${baseUrl}/organisations`);
  });
});

import manifest from './manifest.json';
import { getContext } from './contextCreator';

const mockData = {
  organisationId: 'org1',
  name: 'Greater Manchester CCG',
  odsCode: 'X01',
  primaryRoleId: 'ID123',
  address: '12 Station Road, Leeds, West Yorkshire, LS15 5FG',
  isCatalogueAgreementSigned: true,
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
};

describe('getOrganisationContext', () => {
  it('should return the contents of the manfest', () => {
    const context = getContext({ organisation: {} });
    expect(context.description).toEqual(manifest.description);
    expect(context.orgSubheading).toEqual(manifest.orgSubheading);
    expect(context.editOrgButtonText).toEqual(manifest.editOrgButtonText);
    expect(context.odsCodeHeading).toEqual(manifest.odsCodeHeading);
    expect(context.primaryRoleIdHeading).toEqual(manifest.primaryRoleIdHeading);
    expect(context.addressHeading).toEqual(manifest.addressHeading);
    expect(context.agreementSignedText).toEqual(manifest.agreementSignedText);
    expect(context.accountsSubheading).toEqual(manifest.accountsSubheading);
    expect(context.addUserButtonText).toEqual(manifest.addUserButtonText);
    expect(context.columnInfo).toEqual(manifest.columnInfo);
    expect(context.columnClass).toEqual(manifest.columnClass);
  });

  it('should return an empty array for users key if no data provided', () => {
    const context = getContext({ organisation: {} });
    expect(context.users).toEqual([]);
  });

  it('should transform data into correct format if all data provided', () => {
    const { users } = getContext({ organisation: mockData });
    expect(users[0][0].data).toEqual(`${mockData.users[0].firstName} ${mockData.users[0].lastName}`);
    expect(users[0][0].href).toEqual('#');
    expect(users[0][1].data).toEqual(mockData.users[0].phoneNumber);
    expect(users[0][2].data).toEqual(mockData.users[0].emailAddress);
    expect(users[0][3].tag).toEqual(false);
    expect(users[1][0].data).toEqual(`${mockData.users[1].firstName} ${mockData.users[1].lastName}`);
    expect(users[1][0].href).toEqual('#');
    expect(users[1][1].data).toEqual(mockData.users[1].phoneNumber);
    expect(users[1][2].data).toEqual(mockData.users[1].emailAddress);
    expect(users[1][3].tag.dataTestId).toEqual(`account-disabled-tag-${mockData.users[1].userId}`);
    expect(users[1][3].tag.classes).toEqual('bc-c-tag-outline nhsuk-u-font-size-16');
    expect(users[1][3].tag.text).toEqual('ACCOUNT DISABLED');
  });

  it('should transform data into correct format if data provided has missing fields', () => {
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
    expect(users[0][0].href).toEqual('#');
    expect(users[0][1].data).toEqual('');
    expect(users[0][2].data).toEqual(mockData.users[0].emailAddress);
    expect(users[0][3].tag).toEqual(false);
    expect(users[1][0].data).toEqual(`${mockData.users[1].firstName} ${mockData.users[1].lastName}`);
    expect(users[1][0].href).toEqual('#');
    expect(users[1][1].data).toEqual(mockData.users[1].phoneNumber);
    expect(users[1][2].data).toEqual('');
    expect(users[1][3].tag).toEqual(false);
  });
});

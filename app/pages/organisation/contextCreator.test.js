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
    name: 'John Smith',
    telephone: '07777777777',
    email: 'john.smith@email.com',
    isDisabled: false,
  }, {
    userId: 'user2',
    name: 'Daisy Chain',
    telephone: '07777777778',
    email: 'daisy.chain@email.com',
    isDisabled: true,
  }],
};

describe('getOrgDashboardContext', () => {
  it('should return the contents of the manfest', () => {
    const context = getContext({ data: {} });
    expect(context.description).toEqual(manifest.description);
    expect(context.orgSubheading).toEqual(manifest.orgSubheading);
    expect(context.EditOrgButtonText).toEqual(manifest.EditOrgButtonText);
    expect(context.odsCodeHeading).toEqual(manifest.odsCodeHeading);
    expect(context.primaryRoleIdHeading).toEqual(manifest.primaryRoleIdHeading);
    expect(context.addressHeading).toEqual(manifest.addressHeading);
    expect(context.agreementSignedText).toEqual(manifest.agreementSignedText);
    expect(context.accountsSubheading).toEqual(manifest.accountsSubheading);
    expect(context.addUserButtonText).toEqual(manifest.addUserButtonText);
    expect(context.columnInfo).toEqual(manifest.columnInfo);
    expect(context.columnClass).toEqual(manifest.columnClass);
  });

  it('should return an empty array for data key if no data provided', () => {
    const context = getContext({ data: {} });
    expect(context.data).toEqual([]);
  });

  it('should transform data into correct format if all data provided', () => {
    const { data } = getContext({ data: mockData });
    expect(data[0][0].data).toEqual(mockData.users[0].name);
    expect(data[0][0].href).toEqual('#');
    expect(data[0][1].data).toEqual(mockData.users[0].telephone);
    expect(data[0][2].data).toEqual(mockData.users[0].email);
    expect(data[0][3].tag).toEqual(false);
    expect(data[1][0].data).toEqual(mockData.users[1].name);
    expect(data[1][0].href).toEqual('#');
    expect(data[1][1].data).toEqual(mockData.users[1].telephone);
    expect(data[1][2].data).toEqual(mockData.users[1].email);
    expect(data[1][3].tag.dataTestId).toEqual(`account-disabled-tag-${mockData.users[1].userId}`);
    expect(data[1][3].tag.classes).toEqual('bc-c-tag-outline nhsuk-u-font-size-16');
    expect(data[1][3].tag.text).toEqual('ACCOUNT DISABLED');
  });

  it('should transform data into correct format if data provided has missing fields', () => {
    const modifiedMockData = {
      ...mockData,
      users: [{
        userId: 'user1',
        email: 'john.smith@email.com',
        isDisabled: false,
      }, {
        userId: 'user2',
        name: 'Daisy Chain',
        telephone: '07777777778',
      }],
    };

    const { data } = getContext({ data: modifiedMockData });
    expect(data[0][0].data).toEqual('');
    expect(data[0][0].href).toEqual('#');
    expect(data[0][1].data).toEqual('');
    expect(data[0][2].data).toEqual(mockData.users[0].email);
    expect(data[0][3].tag).toEqual(false);
    expect(data[1][0].data).toEqual(mockData.users[1].name);
    expect(data[1][0].href).toEqual('#');
    expect(data[1][1].data).toEqual(mockData.users[1].telephone);
    expect(data[1][2].data).toEqual('');
    expect(data[1][3].tag).toEqual(false);
  });
});

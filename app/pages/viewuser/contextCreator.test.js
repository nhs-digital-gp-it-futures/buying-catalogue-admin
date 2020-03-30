import manifest from './manifest.json';
import { getContext } from './contextCreator';

const mockData = {
  organisationId: 'org1',
  organisationName: 'A lovely organisation',
  name: 'John Smith',
  phonenumber: '07777777777',
  emailaddress: 'John@Smith.com',
  disabled: false,
};

describe('getViewUserContext', () => {
  it('should return the contents of the manfest', () => {
    const context = getContext({ user: {} });
    expect(context.title).toEqual(manifest.title);
    expect(context.orgHeading).toEqual(manifest.orgHeading);
    expect(context.nameHeading).toEqual(manifest.nameHeading);
    expect(context.phoneNumberHeading).toEqual(manifest.phoneNumberHeading);
    expect(context.emailAddressHeading).toEqual(manifest.emailAddressHeading);
    expect(context.editUserButtonText).toEqual(manifest.editUserButtonText);
  });

  it('should add userName, organisationName, phoneNumber, emailAddress, accountDisabled to the context if provided', () => {
    const context = getContext({ user: mockData });
    expect(context.organisationName).toEqual(mockData.organisationName);
    expect(context.userName).toEqual(mockData.name);
    expect(context.phoneNumber).toEqual(mockData.phonenumber);
    expect(context.emailAddress).toEqual(mockData.emailaddress);
    expect(context.accountDisabled).toEqual(mockData.disabled);
  });

  it('should construct backLinkHref', () => {
    const { backLinkHref } = getContext({ user: mockData });
    expect(backLinkHref).toEqual(`/organisations/${mockData.organisationId}`);
  });

  it('should construct editUserButtonHref', () => {
    const { editUserButtonHref } = getContext({ user: mockData });
    expect(editUserButtonHref).toEqual('#');
  });

  describe('user disabled is true', () => {
    it('should construct correct disableAccountButtonText', () => {
      const { disableAccountButtonText } = getContext({ user: { ...mockData, disabled: true } });
      expect(disableAccountButtonText).toEqual('Re-enable account');
    });

    it('should construct correct disableFormAction', () => {
      const { disableFormAction } = getContext({ user: { ...mockData, disabled: true } });
      expect(disableFormAction).toEqual(`/organisations/${mockData.organisationId}/${mockData.userId}/enable`);
    });
  });

  describe('user disabled is false', () => {
    it('should construct correct disableAccountButtonText', () => {
      const { disableAccountButtonText } = getContext({ user: mockData });
      expect(disableAccountButtonText).toEqual('Disable account');
    });

    it('should construct correct disableFormAction', () => {
      const { disableFormAction } = getContext({ user: { ...mockData } });
      expect(disableFormAction).toEqual(`/organisations/${mockData.organisationId}/${mockData.userId}/disable`);
    });
  });
});

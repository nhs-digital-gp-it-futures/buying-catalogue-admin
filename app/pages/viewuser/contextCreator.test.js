import manifest from './manifest.json';
import { baseUrl } from '../../config';
import { getContext } from './contextCreator';

const mockData = {
  organisationId: 'org1',
  organisationName: 'A lovely organisation',
  name: 'John Smith',
  phoneNumber: '07777777777',
  emailAddress: 'John@Smith.com',
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
    expect(context.phoneNumber).toEqual(mockData.phoneNumber);
    expect(context.emailAddress).toEqual(mockData.emailAddress);
    expect(context.accountDisabled).toEqual(mockData.disabled);
  });

  it('should construct backLinkHref', () => {
    const { backLinkHref } = getContext({ user: mockData });
    expect(backLinkHref).toEqual(`${baseUrl}/organisations/${mockData.organisationId}`);
  });

  it('should construct editUserButtonHref', () => {
    const { editUserButtonHref } = getContext({ user: mockData });
    expect(editUserButtonHref).toEqual('#');
  });

  describe('user disabled is true', () => {
    it('should construct correct changeAccountStatusButtonText', () => {
      const { changeAccountStatusButtonText } = getContext({
        user: { ...mockData, disabled: true },
      });
      expect(changeAccountStatusButtonText).toEqual('Re-enable account');
    });

    it('should construct correct changeAccountStatusFormAction', () => {
      const { changeAccountStatusFormAction } = getContext({
        user: { ...mockData, disabled: true },
      });
      expect(changeAccountStatusFormAction).toEqual(`${baseUrl}/organisations/${mockData.organisationId}/${mockData.userId}/enable`);
    });
  });

  describe('user disabled is false', () => {
    it('should construct correct changeAccountStatusButtonText', () => {
      const { changeAccountStatusButtonText } = getContext({ user: mockData });
      expect(changeAccountStatusButtonText).toEqual('Disable account');
    });

    it('should construct correct changeAccountStatusFormAction', () => {
      const { changeAccountStatusFormAction } = getContext({ user: { ...mockData } });
      expect(changeAccountStatusFormAction).toEqual(`${baseUrl}/organisations/${mockData.organisationId}/${mockData.userId}/disable`);
    });
  });
});

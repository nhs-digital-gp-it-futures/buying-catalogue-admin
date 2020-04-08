import manifest from './manifest.json';
import { getContext, getErrorContext } from './contextCreator';
import * as contextCrErrHelper from './contextCreatorErrorHelper';

jest.mock('./contextCreatorErrorHelper', () => ({
  formatErrors: jest.fn(),
  formatAllErrors: jest.fn(),
  addErrorsAndDataToManifest: jest.fn(),
}));

const mockData = {
  organisationId: 'org1',
  name: 'Manchester',
};

const mockValidationErrors = [{
  field: 'LastName',
  id: 'LastNameRequired',
},
{
  field: 'FirstName',
  id: 'FirstNameTooLong',
}];

describe('adduser contextCreator', () => {
  describe('getContext', () => {
    it('should return the contents of the manifest', () => {
      const context = getContext({});
      expect(context.title).toEqual(manifest.title);
      expect(context.description).toEqual(manifest.description);
      expect(context.orgNameSubheading).toEqual(manifest.orgNameSubheading);
      expect(context.questions.length).toEqual(manifest.questions.length);
      context.questions.forEach((question, i) => {
        expect(question.id).toEqual(manifest.questions[i].id);
        expect(question.mainAdvice).toEqual(manifest.questions[i].mainAdvice);
      });
      expect(context.addUserButtonText).toEqual(manifest.addUserButtonText);
    });

    it('should add organisationId and organisationName from the data provided', () => {
      const context = getContext(mockData);
      expect(context.organisationId).toEqual(mockData.organisationId);
      expect(context.organisationName).toEqual(mockData.name);
    });

    it('should construct backLinkHref from the data provided', () => {
      const context = getContext(mockData);
      expect(context.backLinkHref).toEqual(`/organisations/${mockData.organisationId}`);
    });
  });

  describe('getErrorContext', () => {
    beforeEach(() => {
      contextCrErrHelper.addErrorsAndDataToManifest.mockImplementation(() => manifest);
    });

    afterEach(() => {
      contextCrErrHelper.formatErrors.mockReset();
      contextCrErrHelper.formatAllErrors.mockReset();
      contextCrErrHelper.addErrorsAndDataToManifest.mockReset();
    });

    it('should return the contents of the manifest', () => {
      const context = getErrorContext({ orgData: {}, validationErrors: [], data: {} });
      expect(context.title).toEqual(manifest.title);
      expect(context.description).toEqual(manifest.description);
      expect(context.orgNameSubheading).toEqual(manifest.orgNameSubheading);
      expect(context.questions.length).toEqual(manifest.questions.length);
      context.questions.forEach((question, i) => {
        expect(question.id).toEqual(manifest.questions[i].id);
        expect(question.text).toEqual(manifest.questions[i].text);
      });
      expect(context.addUserButtonText).toEqual(manifest.addUserButtonText);
    });

    it('should add organisationId and organisationName from the data provided', () => {
      const context = getErrorContext({ orgData: mockData, validationErrors: [] });
      expect(context.organisationId).toEqual(mockData.organisationId);
      expect(context.organisationName).toEqual(mockData.name);
    });

    it('should construct backLinkHref from the data provided', () => {
      const context = getErrorContext({ orgData: mockData, validationErrors: [] });
      expect(context.backLinkHref).toEqual(`/organisations/${mockData.organisationId}`);
    });

    it('should construct errors array from the data provided', () => {
      contextCrErrHelper.formatAllErrors.mockImplementation(() => ([
        { href: '#firstName', text: 'First name is too long' },
        { href: '#lastName', text: 'Last name is required' },
      ]));
      const context = getErrorContext({
        orgData: mockData,
        validationErrors: mockValidationErrors,
      });

      expect(context.errors.length).toEqual(mockValidationErrors.length);
      expect(context.errors[0].href).toEqual('#firstName');
      expect(context.errors[0].text).toEqual('First name is too long');
      expect(context.errors[1].href).toEqual('#lastName');
      expect(context.errors[1].text).toEqual('Last name is required');
    });

    it('should call the helper functions', () => {
      getErrorContext({ orgData: mockData, validationErrors: mockValidationErrors, data: {} });
      expect(contextCrErrHelper.formatErrors.mock.calls.length).toEqual(1);
      expect(contextCrErrHelper.addErrorsAndDataToManifest.mock.calls.length).toEqual(1);
      expect(contextCrErrHelper.formatAllErrors.mock.calls.length).toEqual(1);
    });
  });
});

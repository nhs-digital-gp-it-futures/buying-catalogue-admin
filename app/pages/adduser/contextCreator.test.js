import manifest from './manifest.json';
import { getContext, getErrorContext } from './contextCreator';

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
        expect(question.text).toEqual(manifest.questions[i].text);
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
    it('should return the contents of the manifest', () => {
      const context = getErrorContext({ orgData: {}, validationErrors: [] });
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
  });
});

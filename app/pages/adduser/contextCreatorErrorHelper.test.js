import { formatErrors, formatAllErrors, addErrorsToManifest } from './contextCreatorErrorHelper';
import manifest from './manifest.json';

const errors = [
  { field: 'EmailAddress', id: 'EmailRequired' },
  { field: 'EmailAddress', id: 'EmailTooLong' },
  { field: 'LastName', id: 'LastNameTooLong' },
];

describe('contextCreatorErrorHelper', () => {
  describe('formatErrors', () => {
    it('should create error object with field as key and array of messages for one error', () => {
      const formattedErrors = formatErrors([errors[0]]);
      expect(formattedErrors).toEqual({ emailAddress: ['Email address is required'] });
    });

    it('should create error object with field as key and array of messages for multiple errors', () => {
      const formattedErrors = formatErrors(errors);
      expect(formattedErrors.emailAddress).toEqual(
        ['Email address is required', 'Email address is too long'],
      );
      expect(formattedErrors.lastName).toEqual(['Last name is too long']);
    });
  });

  describe('addErrorsToManifest', () => {
    const formattedErrors = formatErrors(errors);
    it('should return the contents of the manifest', () => {
      const manifestWithErrors = addErrorsToManifest(formattedErrors);
      expect(manifestWithErrors.title).toEqual(manifest.title);
      expect(manifestWithErrors.description).toEqual(manifest.description);
      expect(manifestWithErrors.orgNameSubheading).toEqual(manifest.orgNameSubheading);
      expect(manifestWithErrors.questions.length).toEqual(manifest.questions.length);
      manifestWithErrors.questions.forEach((question, i) => {
        expect(question.id).toEqual(manifest.questions[i].id);
        expect(question.text).toEqual(manifest.questions[i].text);
      });
      expect(manifestWithErrors.addUserButtonText).toEqual(manifest.addUserButtonText);
    });

    it('should add the errors to the correct questions', () => {
      const manifestWithErrors = addErrorsToManifest(formattedErrors);
      expect(manifestWithErrors.questions[0].error).toEqual(undefined);
      expect(manifestWithErrors.questions[1].error).toEqual({ message: 'Last name is too long' });
      expect(manifestWithErrors.questions[2].error).toEqual(undefined);
      expect(manifestWithErrors.questions[3].error).toEqual({ message: 'Email address is required, Email address is too long' });
    });
  });

  describe('formatAllErrors', () => {
    const formattedErrors = formatErrors(errors);
    const manifestWithErrors = addErrorsToManifest(formattedErrors);
    it('should return an array of error objects in the correct format', () => {
      const allErrors = formatAllErrors(manifestWithErrors.questions);
      expect(allErrors[0].href).toEqual('#lastName');
      expect(allErrors[0].text).toEqual('Last name is too long');
      expect(allErrors[1].href).toEqual('#emailAddress');
      expect(allErrors[1].text).toEqual('Email address is required');
      expect(allErrors[2].href).toEqual('#emailAddress');
      expect(allErrors[2].text).toEqual('Email address is too long');
    });
  });
});

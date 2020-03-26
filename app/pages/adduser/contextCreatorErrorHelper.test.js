import { formatErrors, formatAllErrors, addErrorsToManifest } from './contextCreatorErrorHelper';
import manifest from './manifest.json';

const errors = [
  { field: 'emailAddress', id: 'EmailRequired' },
  { field: 'emailAddress', id: 'EmailTooLong' },
  { field: 'lastName', id: 'LastNameTooLong' },
];

describe('contextCreatorErrorHelper', () => {
  describe('formatErrors', () => {
    it('should create error object with field as key and array of messages for one error', () => {
      const formattedErrors = formatErrors([errors[0]]);
      expect(formattedErrors).toEqual({ [errors[0].field]: [manifest.errorMessages[errors[0].id]] });
    });

    it('should create error object with field as key and array of messages for multiple errors', () => {
      const formattedErrors = formatErrors(errors);
      expect(formattedErrors.emailAddress).toEqual(
        [manifest.errorMessages[errors[0].id], manifest.errorMessages[errors[1].id]],
      );
      expect(formattedErrors.lastName).toEqual([manifest.errorMessages[errors[2].id]]);
    });
  });

  describe('addErrorsToManifest', () => {
    const formattedErrors = formatErrors(errors);
    it('should return the contents of the manifest', () => {
      const manifestWithErrors = addErrorsToManifest({ errors: formattedErrors });
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
      const manifestWithErrors = addErrorsToManifest({ errors: formattedErrors });
      expect(manifestWithErrors.questions[3].error).toEqual({ message: formattedErrors.emailAddress.join(', ') });
      expect(manifestWithErrors.questions[1].error).toEqual({ message: formattedErrors.lastName.join(', ') });
    });
  });

  describe('formatAllErrors', () => {
    const formattedErrors = formatErrors(errors);
    it('should return an array of error objects in the correct format', () => {
      const allErrors = formatAllErrors(formattedErrors);
      expect(allErrors[0].href).toEqual('#emailAddress');
      expect(allErrors[0].text).toEqual(formattedErrors.emailAddress[0]);
      expect(allErrors[1].href).toEqual('#emailAddress');
      expect(allErrors[1].text).toEqual(formattedErrors.emailAddress[1]);
      expect(allErrors[2].href).toEqual('#lastName');
      expect(allErrors[2].text).toEqual(formattedErrors.lastName[0]);
    });
  });
});

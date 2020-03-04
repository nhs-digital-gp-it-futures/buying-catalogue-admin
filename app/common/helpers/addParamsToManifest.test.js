import { addParamsToManifest } from './addParamsToManifest';

const exampleManifest = {
  title: 'You have added the user {{username}}.',
  description: 'An email has been sent to {{emailAddress}} so they can reset their password.',
  details: {
    organisation: {
      name: '{{username}} is from the {{organisationName}} organisation.',
    },
    user: {
      name: '{{username}}\'s real name is {{firstName}} {{lastName}}.',
      email: '{{username}}\'s email address is {{emailAddress}}.',
    },
  },
  params: [
    {
      key: 'username',
      value: '{{username}}',
    },
    {
      key: 'emailAddress',
      value: '{{emailAddress}}',
    },
    {
      key: 'firstName',
      value: '{{firstName}}',
    },
    {
      key: 'lastName',
      value: '{{lastName}}',
    },
    {
      key: 'fullName',
      value: '{{firstName}} {{lastName}}',
    },
  ],
};

const expectedManifestWithParams = {
  title: 'You have added the user john_smith.',
  description: 'An email has been sent to john.smith@email.com so they can reset their password.',
  details: {
    organisation: {
      name: 'john_smith is from the Secret organisation.',
    },
    user: {
      name: 'john_smith\'s real name is John Smith.',
      email: 'john_smith\'s email address is john.smith@email.com.',
    },
  },
  params: [
    {
      key: 'username',
      value: 'john_smith',
    },
    {
      key: 'emailAddress',
      value: 'john.smith@email.com',
    },
    {
      key: 'firstName',
      value: 'John',
    },
    {
      key: 'lastName',
      value: 'Smith',
    },
    {
      key: 'fullName',
      value: 'John Smith',
    },
  ],
};

describe('addParamsToManifest', () => {
  it('should add params to manifest', () => {
    const manifestWithParams = addParamsToManifest(exampleManifest, {
      username: 'john_smith',
      emailAddress: 'john.smith@email.com',
      firstName: 'John',
      lastName: 'Smith',
      organisationName: 'Secret',
    });

    expect(manifestWithParams).toEqual(expectedManifestWithParams);
  });
});

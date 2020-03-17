import manifest from './manifest.json';
import { getContext } from './contextCreator';

const mockData = {
  organisationId: 'org1',
  name: 'Manchester',
};

describe('getContext', () => {
  it('should return the contents of the manfest', () => {
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

  it('should add organisationId and orgName from the data provided', () => {
    const context = getContext(mockData);
    expect(context.organisationId).toEqual(mockData.organisationId);
    expect(context.orgName).toEqual(mockData.name);
  });

  it('should add submitActionUrl from the provided organisation id', () => {
    const context = getContext(mockData);
    expect(context.submitActionUrl).toEqual(`/organisations/${mockData.organisationId}/adduser`);
  });
});

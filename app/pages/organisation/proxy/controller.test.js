import {
  getData,
  postData,
  deleteData,
  ErrorContext,
} from 'buying-catalogue-library';
import {
  validateAddProxyForm,
  formatUnrelatedOrgsRadio,
  formatRelatedOrgsTable,
  getUnrelatedOrganisations,
  getRelatedOrganisations,
  getOrganisation,
  deleteRelatedOrganisation,
  postRelatedOrganisation,
} from './controller';
import { logger } from '../../../logger';
import { organisationApiUrl } from '../../../config';
import {
  organisation,
  unrelatedOrgs,
  unrelatedOrgsRadio,
  relatedOrgs,
  relatedOrgsTable,
} from './mockData';

jest.mock('buying-catalogue-library');

describe('organisation add proxy controller', () => {
  describe('getUnrelatedOrganisations', () => {
    const accessToken = 'access_token';
    const organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085';

    afterEach(() => {
      getData.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce({});
      await getUnrelatedOrganisations({ organisationId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/Organisations/${organisationId}/unrelated-organisations`, accessToken, logger });
    });

    it('should return unrelated organisations if there is no error', async () => {
      getData.mockResolvedValueOnce(unrelatedOrgs);
      const response = await getUnrelatedOrganisations({ organisationId, accessToken });
      expect(response).toEqual(unrelatedOrgs);
    });

    it('should return can instance of ErrorContext if an exception is thrown', async () => {
      getData.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await expect(getUnrelatedOrganisations({ organisationId, accessToken }))
        .rejects
        .toBeInstanceOf(ErrorContext);
    });
  });

  describe('getRelatedOrganisations', () => {
    const accessToken = 'access_token';
    const organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085';

    afterEach(() => {
      getData.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce({});
      await getRelatedOrganisations({ organisationId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/Organisations/${organisationId}/related-organisations`, accessToken, logger });
    });

    it('should return related organisations if there is no error', async () => {
      getData.mockResolvedValueOnce(relatedOrgs);
      const response = await getRelatedOrganisations({ organisationId, accessToken });
      expect(response).toEqual(relatedOrgs);
    });

    it('should return can instance of ErrorContext if an exception is thrown', async () => {
      getData.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await expect(getRelatedOrganisations({ organisationId, accessToken }))
        .rejects
        .toBeInstanceOf(ErrorContext);
    });
  });

  describe('getOrganisation', () => {
    const accessToken = 'access_token';
    const organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085';

    afterEach(() => {
      getData.mockReset();
    });

    it('should call getData once with the correct params', async () => {
      getData
        .mockResolvedValueOnce({});
      await getOrganisation({ organisationId, accessToken });
      expect(getData.mock.calls.length).toEqual(1);
      expect(getData).toHaveBeenCalledWith({ endpoint: `${organisationApiUrl}/api/v1/Organisations/${organisationId}`, accessToken, logger });
    });

    it('should return an organisation if there is no error', async () => {
      getData.mockResolvedValueOnce(organisation);
      const response = await getOrganisation({ organisationId, accessToken });
      expect(response).toEqual(organisation);
    });

    it('should return can instance of ErrorContext if an exception is thrown', async () => {
      getData.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await expect(getOrganisation({ organisationId, accessToken }))
        .rejects
        .toBeInstanceOf(ErrorContext);
    });
  });

  describe('postRelatedOrganisation', () => {
    const accessToken = 'access_token';
    const organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085';
    const relatedOrganisationId = '6d37d7fb-df06-403c-9c46-d649919f9158';

    it('should call postData once with the correct params', async () => {
      postData.mockResolvedValueOnce({
        data: {
          organisationId,
          relatedOrganisationId,
        },
      });

      await postRelatedOrganisation({ organisationId, relatedOrganisationId, accessToken });

      expect(postData.mock.calls.length).toEqual(1);
      expect(postData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/${organisationId}/related-organisations`,
        body: {
          relatedOrganisationId,
        },
        accessToken,
        logger,
      });
    });

    it('should return organisationId and relatedOrganisationId if successful', async () => {
      const response = await postRelatedOrganisation(
        { organisationId, relatedOrganisationId, accessToken },
      );
      expect(response).toEqual({ organisationId, relatedOrganisationId });
    });

    it('should return an instance of ErrorContext if api request is unsuccessful', async () => {
      postData.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await expect(postRelatedOrganisation({ organisationId, relatedOrganisationId, accessToken }))
        .rejects
        .toBeInstanceOf(ErrorContext);
    });
  });

  describe('deleteRelatedOrganisation', () => {
    const accessToken = 'access_token';
    const organisationId = 'b7ee5261-43e7-4589-907b-5eef5e98c085';
    const relatedOrganisationId = '6d37d7fb-df06-403c-9c46-d649919f9158';

    it('should call deleteData once with the correct params', async () => {
      deleteData.mockResolvedValueOnce({
        data: {
          organisationId,
          relatedOrganisationId,
        },
      });

      await deleteRelatedOrganisation({ organisationId, relatedOrganisationId, accessToken });

      expect(deleteData.mock.calls.length).toEqual(1);
      expect(deleteData).toHaveBeenCalledWith({
        endpoint: `${organisationApiUrl}/api/v1/Organisations/${organisationId}/related-organisations/${relatedOrganisationId}`,
        body: {
          relatedOrganisationId,
        },
        accessToken,
        logger,
      });
    });

    it('should return organisationId and relatedOrganisationId if successful', async () => {
      const response = await deleteRelatedOrganisation(
        { organisationId, relatedOrganisationId, accessToken },
      );
      expect(response).toEqual({ organisationId, relatedOrganisationId });
    });

    it('should return an instance of ErrorContext if api request is unsuccessful', async () => {
      deleteData.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
      await expect(
        deleteRelatedOrganisation({ organisationId, relatedOrganisationId, accessToken }),
      )
        .rejects
        .toBeInstanceOf(ErrorContext);
    });
  });

  describe('add proxy functions', () => {
    afterEach(() => {
      getData.mockReset();
    });

    it('it should format unrelated organisations into a format acceptable to a radio control', async () => {
      expect(formatUnrelatedOrgsRadio(unrelatedOrgs)).toEqual(unrelatedOrgsRadio);
    });

    it('it should format related organisations into a table with remove', async () => {
      expect(formatRelatedOrgsTable(relatedOrgs, 'orgId')).toEqual(relatedOrgsTable);
    });
  });

  describe('valiade proxy form', () => {
    afterEach(() => {
      getData.mockReset();
    });

    it('it should return an error object if no organisation ID is provided', async () => {
      expect(Object.keys(validateAddProxyForm({
        req: {
          body: {},
        },
      }))).toEqual(['message', 'errorList']);
    });

    it('it should return false if an organisation ID is provided', async () => {
      expect(validateAddProxyForm({
        req: {
          body: {
            relatedOrganisationId: 'dummyId',
          },
        },
      })).toEqual(false);
    });
  });
});

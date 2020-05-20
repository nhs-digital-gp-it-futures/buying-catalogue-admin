import request from 'supertest';
import {
  FakeAuthProvider,
  testAuthorisedGetPathForUnauthenticatedUser,
  testAuthorisedGetPathForUnauthorisedUser,
  testPostPathWithoutCsrf,
  testAuthorisedPostPathForUnauthenticatedUser,
  testAuthorisedPostPathForUnauthorisedUsers,
  getCsrfTokenFromGet,
} from 'buying-catalogue-library';
import { App } from '../../app';
import { routes } from '../../routes';
import { baseUrl } from '../../config';
import * as selectOrgController from './selectorg/controller';
import * as createOrgErrorController from './error/controller';
import * as findOrgController from './findorg/controller';
import * as createOrgController from './createorg/controller';
import * as createOrgConfirmationController from './confirmation/controller';

jest.mock('../../logger');

selectOrgController.getSelectOrgContext = jest.fn()
  .mockResolvedValue({});

findOrgController.getFindOrgContext = jest.fn()
  .mockResolvedValue({});

findOrgController.getFindOrgByOds = jest.fn()
  .mockResolvedValue({ success: true });

createOrgConfirmationController.getCreateOrgConfirmationContext = jest.fn()
  .mockResolvedValue({ dataTestId: 'create-org-confirmation' });

createOrgController.postAddOrg = jest.fn()
  .mockResolvedValue({ success: true, orgId: 'org1', data: {} });

createOrgController.getCreateOrgContext = jest.fn()
  .mockResolvedValue({});

const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));

const mockAuthorisedJwtPayload = JSON.stringify({
  id: '88421113', name: 'Cool Dude', organisation: 'view',
});
const mockAuthorisedCookie = `fakeToken=${mockAuthorisedJwtPayload}`;

const mockUnauthorisedJwtPayload = JSON.stringify({
  id: '88421113', name: 'Cool Dude',
});
const mockUnauthorisedCookie = `fakeToken=${mockUnauthorisedJwtPayload}`;

const setUpFakeApp = () => {
  const authProvider = new FakeAuthProvider(mockLogoutMethod);
  const app = new App(authProvider).createApp();
  app.use('/', routes(authProvider));
  return app;
};

describe('routes', () => {
  describe('GET /organisations/find', () => {
    const path = '/organisations/find';

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedGetPathForUnauthenticatedUser({
        app: request(setUpFakeApp()), pathToTest: path, expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedGetPathForUnauthorisedUser({
        app: request(setUpFakeApp()),
        pathToTest: path,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="find-org-page"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
      }));
  });

  describe('POST /organisations/find', () => {
    const path = '/organisations/find';
    it('should return 403 forbidden if no csrf token is available', () => (
      testPostPathWithoutCsrf({
        app: request(setUpFakeApp()), pathToTest: path, mockAuthorisedCookie,
      })
    ));

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedPostPathForUnauthenticatedUser({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedPostPathForUnauthorisedUsers({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should redirect to /organisations/find/select if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select?ods=abc`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find if response.success is false ans status is 404', async () => {
      findOrgController.getFindOrgByOds = jest.fn()
        .mockResolvedValueOnce({ success: false, errorStatus: 404 });

      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find?ods=abc&error=404`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find if response.success is false ans status is 406', async () => {
      findOrgController.getFindOrgByOds = jest.fn()
        .mockResolvedValueOnce({ success: false, errorStatus: 406 });

      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find?ods=abc&error=406`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select', () => {
    const path = '/organisations/find/select?ods=abc';

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedGetPathForUnauthenticatedUser({
        app: request(setUpFakeApp()), pathToTest: path, expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedGetPathForUnauthorisedUser({
        app: request(setUpFakeApp()),
        pathToTest: path,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text when the user is authorised', () => {
      selectOrgController.getSelectOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="select-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/find/select', () => {
    const path = '/organisations/find/select?ods=abc';
    it('should return 403 forbidden if no csrf token is available', () => (
      testPostPathWithoutCsrf({
        app: request(setUpFakeApp()), pathToTest: path, mockAuthorisedCookie,
      })
    ));

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedPostPathForUnauthenticatedUser({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedPostPathForUnauthorisedUsers({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select/create?ods=abc`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create', () => {
    const path = '/organisations/find/select/create?ods=abc';

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedGetPathForUnauthenticatedUser({
        app: request(setUpFakeApp()), pathToTest: path, expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedGetPathForUnauthorisedUser({
        app: request(setUpFakeApp()),
        pathToTest: path,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="create-org-page"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
      }));
  });

  describe('POST /organisations/find/select/create', () => {
    const path = '/organisations/find/select/create';

    it('should return 403 forbidden if no csrf token is available', () => (
      testPostPathWithoutCsrf({
        app: request(setUpFakeApp()), pathToTest: path, mockAuthorisedCookie,
      })
    ));

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedPostPathForUnauthenticatedUser({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedPostPathForUnauthorisedUsers({
        app: request(setUpFakeApp()),
        csrfPagePath: path,
        pathToTest: path,
        mockAuthorisedCookie,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should redirect to /organisations/find/select/create/confirmation if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select/create/confirmation?id=org1`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find/select/create/error if response.status is false', async () => {
      createOrgController.postAddOrg = jest.fn()
        .mockResolvedValueOnce({ success: false, errorsString: 'AnErrorId+ASecondErrorId' });

      const { cookies, csrfToken } = await getCsrfTokenFromGet({
        app: request(setUpFakeApp()), csrfPagePath: path, mockAuthorisedCookie,
      });

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select/create/error?ods=abc&errors=AnErrorId+ASecondErrorId`);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create/confirmation', () => {
    const path = '/organisations/find/select/create/confirmation?id=org1';

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedGetPathForUnauthenticatedUser({
        app: request(setUpFakeApp()), pathToTest: path, expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedGetPathForUnauthorisedUser({
        app: request(setUpFakeApp()),
        pathToTest: path,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="create-org-confirmation-page"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
      }));
  });

  describe('GET /organisations/find/select/create/error', () => {
    const path = '/organisations/find/select/create/error?ods=abc&errors=AnErrorString';

    it('should redirect to the login page if the user is not logged in', () => (
      testAuthorisedGetPathForUnauthenticatedUser({
        app: request(setUpFakeApp()), pathToTest: path, expectedRedirectPath: 'http://identity-server/login',
      })
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      testAuthorisedGetPathForUnauthorisedUser({
        app: request(setUpFakeApp()),
        pathToTest: path,
        mockUnauthorisedCookie,
        expectedPageId: 'data-test-id="error-title"',
        expectedPageMessage: 'You are not authorised to view this page',
      })
    ));

    it('should return the correct status and text when the user is authorised', () => {
      createOrgErrorController.getCreateOrgErrorContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'create-org-error' }));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="create-org-error-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-title"')).toEqual(false);
        });
    });
  });
});

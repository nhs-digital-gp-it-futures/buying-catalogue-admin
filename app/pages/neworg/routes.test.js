import request from 'supertest';
import { App } from '../../app';
import { routes } from '../../routes';
import { baseUrl } from '../../config';
import { FakeAuthProvider } from '../../test-utils/FakeAuthProvider';
import { getCsrfTokenFromGet } from '../../test-utils/helper';
import * as selectOrgContext from './selectorg/controller';
import * as createOrgErrorContext from './error/controller';
import * as findOrgContext from './findorg/controller';
import * as createOrgContext from './createorg/controller';
import * as apiProvider from '../../apiProvider';

jest.mock('../../logger');

jest.mock('../../apiProvider', () => ({
  getData: jest.fn()
    .mockImplementation(() => Promise.resolve({})),
  postData: jest.fn()
    .mockImplementation(() => Promise.resolve({ success: true })),
  putData: jest.fn()
    .mockImplementation(() => Promise.resolve({ success: true })),
}));

const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));

const mockAuthorisedJwtPayload = JSON.stringify({
  id: '88421113', name: 'Cool Dude', organisation: 'view',
});

const mockAuthorisedCookie = `fakeToken=${mockAuthorisedJwtPayload}`;

const setUpFakeApp = () => {
  const authProvider = new FakeAuthProvider(mockLogoutMethod);
  const app = new App(authProvider).createApp();
  app.use('/', routes(authProvider));
  return app;
};

const checkAuthorisedRouteNotLoggedIn = path => (
  request(setUpFakeApp())
    .get(path)
    .expect(302)
    .then((res) => {
      expect(res.redirect).toEqual(true);
      expect(res.headers.location).toEqual('http://identity-server/login');
    }));

const checkAuthorisedRouteWithoutClaim = (path) => {
  const mockUnauthorisedJwtPayload = JSON.stringify({
    id: '88421113', name: 'Cool Dude',
  });
  const mockUnauthorisedCookie = `fakeToken=${mockUnauthorisedJwtPayload}`;

  request(setUpFakeApp())
    .get(path)
    .set('Cookie', [mockUnauthorisedCookie])
    .expect(200)
    .then((res) => {
      expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      expect(res.text.includes('Not authorised')).toEqual(true);
    });
};

const checkForbiddenNoCsrf = path => request(setUpFakeApp())
  .post(path)
  .set('Cookie', [mockAuthorisedCookie])
  .type('form')
  .send({})
  .then((res) => {
    expect(res.status).toEqual(403);
  });


const checkRedirectToLogin = async (csrfPagePath, postPath) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet(
    setUpFakeApp(), csrfPagePath, mockAuthorisedCookie,
  );

  return request(setUpFakeApp())
    .post(postPath)
    .type('form')
    .set('Cookie', [cookies])
    .send({
      _csrf: csrfToken,
    })
    .expect(302)
    .then((res) => {
      expect(res.redirect).toEqual(true);
      expect(res.headers.location).toEqual('http://identity-server/login');
    });
};

const checkLoggedInNotAuthorised = async (csrfPagePath, postPath) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet(
    setUpFakeApp(), csrfPagePath, mockAuthorisedCookie,
  );

  const mockUnauthorisedJwtPayload = JSON.stringify({
    id: '88421113', name: 'Cool Dude',
  });
  const mockUnauthorisedCookie = `fakeToken=${mockUnauthorisedJwtPayload}`;

  return request(setUpFakeApp())
    .post(postPath)
    .type('form')
    .set('Cookie', [cookies, mockUnauthorisedCookie])
    .send({ _csrf: csrfToken })
    .expect(200)
    .then((res) => {
      expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      expect(res.text.includes('Not authorised')).toEqual(true);
    });
};

describe('routes', () => {
  describe('GET /organisations/find', () => {
    const path = '/organisations/find';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      findOrgContext.getAddOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="find-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should extract errorCode from url and return the correct status and text when error is present', () => {
      findOrgContext.getAddOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(`${path}?odsCode=abc&error=404`)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="find-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-summary"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/find', () => {
    const path = '/organisations/find';
    apiProvider.postData = jest.fn()
      .mockImplementation(() => Promise.resolve({ success: true, data: {} }));

    it('should return 403 forbidden if no csrf token is available', async () => {
      await checkForbiddenNoCsrf(path);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      await checkRedirectToLogin(path, path);
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      await checkLoggedInNotAuthorised(path, path);
    });

    it('should redirect to /organisations/find/select if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select?ods=abc`);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find if response.success is false ans status is 404', async () => {
      findOrgContext.getFindOrgByOds = jest.fn()
        .mockResolvedValueOnce({ success: false, errorStatus: 404 });

      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/find?ods=abc&error=404');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find if response.success is false ans status is 406', async () => {
      findOrgContext.getFindOrgByOds = jest.fn()
        .mockResolvedValueOnce({ success: false, errorStatus: 406 });

      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/find?ods=abc&error=406');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select', () => {
    const path = '/organisations/find/select?ods=abc';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      selectOrgContext.getSelectOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="select-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/find/select', () => {
    const path = '/organisations/find/select?ods=abc';
    apiProvider.postData = jest.fn()
      .mockImplementation(() => Promise.resolve({ success: true, data: {} }));

    it('should return 403 forbidden if no csrf token is available', async () => {
      await checkForbiddenNoCsrf(path);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      await checkRedirectToLogin(path, path);
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      await checkLoggedInNotAuthorised(path, path);
    });

    it('should return the correct status and text if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select/create?ods=abc`);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create', () => {
    const path = '/organisations/find/select/create?ods=abc';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      selectOrgContext.getSelectOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="create-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/find/select/create', () => {
    const path = '/organisations/find/select/create';
    apiProvider.postData = jest.fn()
      .mockImplementation(() => Promise.resolve({ success: true, data: {} }));

    it('should return 403 forbidden if no csrf token is available', async () => {
      await checkForbiddenNoCsrf(path);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      await checkRedirectToLogin(path, path);
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      await checkLoggedInNotAuthorised(path, path);
    });

    it('should redirect to /organisations/find/select/create/confirmation if response.success is true', async () => {
      createOrgContext.postAddOrg = jest.fn().mockResolvedValueOnce({ success: true, orgId: 'org1' });
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/find/select/create/confirmation?id=org1');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should redirect to /organisations/find/select/create/error if response.status is false', async () => {
      createOrgContext.postAddOrg = jest.fn()
        .mockResolvedValueOnce({ success: false, errorsString: 'AnErrorId+ASecondErrorId' });

      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken, odsCode: 'abc' })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual(`${baseUrl}/organisations/find/select/create/error?ods=abc&errors=AnErrorId+ASecondErrorId`);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create/confirmation', () => {
    const path = '/organisations/find/select/create/confirmation?id=org1';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      selectOrgContext.getSelectOrgContext = jest.fn()
        .mockImplementation(() => ({}));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="create-org-confirmation-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create/error', () => {
    const path = '/organisations/find/select/create/error?ods=abc&errors=AnErrorString';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      createOrgErrorContext.getCreateOrgErrorContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'create-org-error' }));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="create-org-error-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });
});

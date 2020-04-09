import request from 'supertest';
import { App } from '../../app';
import { routes } from '../../routes';
import { FakeAuthProvider } from '../../test-utils/FakeAuthProvider';
import { getCsrfTokenFromGet } from '../../test-utils/helper';
import * as addOrgContext from './findorg/controller';
import * as selectOrgContext from './selectorg/controller';

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
      addOrgContext.getAddOrgContext = jest.fn()
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
  });

  describe('POST /organisations/find', () => {
    const path = '/organisations/find';

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
        .send({ _csrf: csrfToken })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/find/select');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select', () => {
    const path = '/organisations/find/select';

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
    const path = '/organisations/find/select';

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
        .send({ _csrf: csrfToken })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/find/select/create');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/find/select/create', () => {
    const path = '/organisations/find/select/create';

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
});

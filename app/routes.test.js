import request from 'supertest';
import { App } from './app';
import { routes } from './routes';
import { FakeAuthProvider } from './test-utils/FakeAuthProvider';
import { getCsrfTokenFromGet, setFakeCookie } from './test-utils/helper';
import * as orgDashboardContext from './pages/dashboard/contextCreator';
import * as addUserController from './pages/adduser/controller';

jest.mock('./logger');

const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));

const mockAuthorisedJwtPayload = JSON.stringify({
  id: '88421113', name: 'Cool Dude', organisation: 'view',
});

const fakeAuthorisedCookie = `fakeToken=${mockAuthorisedJwtPayload}`;

const setUpFakeApp = () => {
  const authProvider = new FakeAuthProvider(mockLogoutMethod);
  const app = new App(authProvider).createApp();
  app.use('/', routes(authProvider));
  return app;
};

const mockAddUserData = {
  firstName: 'Jane',
  lastName: 'Jones',
  phoneNumber: '07777777777',
  emailAdress: 'jane.jones@email.com',
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
  const fakeUnauthorisedCookie = `fakeToken=${mockUnauthorisedJwtPayload}`;

  request(setUpFakeApp())
    .get(path)
    .set('Cookie', [fakeUnauthorisedCookie])
    .expect(200)
    .then((res) => {
      expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      expect(res.text.includes('Not authorised')).toEqual(true);
    });
};

describe('routes', () => {
  describe('GET /health/live', () => {
    it('should return the correct status and text', () => (
      request(setUpFakeApp())
        .get('/health/live')
        .expect(200)
        .then((res) => {
          expect(res.text).toBe('Buying Catalogue Admin app is running!');
        })));
  });

  describe('GET /login', () => {
    it('should return the correct status and redirect to the login page when not authenticated', () => (
      request(setUpFakeApp())
        .get('/login')
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('http://identity-server/login');
        })));
  });

  describe('GET /logout', () => {
    it('should redirect to the url provided by authProvider', async () => (
      request(setUpFakeApp())
        .get('/logout')
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/signout-callback-oidc');
        })));
  });

  describe('GET /signout-callback-oidc', () => {
    afterEach(() => {
      mockLogoutMethod.mockReset();
    });

    it('should redirect to /', async () => (
      request(setUpFakeApp())
        .get('/signout-callback-oidc')
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/');
        })));

    it('should call req.logout', async () => (
      request(setUpFakeApp())
        .get('/signout-callback-oidc')
        .expect(302)
        .then(() => {
          expect(mockLogoutMethod.mock.calls.length).toEqual(1);
        })));

    it('should delete cookies', async () => {
      const { modifiedApp, cookies } = await setFakeCookie(setUpFakeApp(), '/signout-callback-oidc');
      expect(cookies.length).toEqual(2);

      return request(modifiedApp)
        .get('/')
        .expect(200)
        .then((res) => {
          expect(res.headers['set-cookie'].length).toEqual(1);
        });
    });
  });

  describe('GET /organisations', () => {
    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn('/organisations')
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim('/organisations')
    ));

    it('should return the correct status and text when the user is authorised', () => {
      orgDashboardContext.getOrgDashboardContext = jest.fn()
        .mockImplementation(() => {});

      return request(setUpFakeApp())
        .get('/organisations')
        .set('Cookie', [fakeAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="organisations"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:orgId', () => {
    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn('/organisations/org1')
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim('/organisations/org1')
    ));

    it('should return the correct status and text', () => (
      request(setUpFakeApp())
        .get('/organisations/org1')
        .set('Cookie', [fakeAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="org-page-title"')).toEqual(true);
        })));
  });

  describe('GET /organisations/:orgId/adduser', () => {
    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn('/organisations/org1/adduser')
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim('/organisations/org1/adduser')
    ));

    it('should return the correct status and text', () => (
      request(setUpFakeApp())
        .get('/organisations/org1/adduser')
        .set('Cookie', [fakeAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="add-user-page"')).toEqual(true);
        })));
  });

  describe('POST /organisations/:orgId/adduser', () => {
    afterEach(() => {
      addUserController.postAddUser.mockReset();
    });

    it('should return 403 forbidden if no csrf token is available', () => {
      addUserController.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: true }));

      return request(setUpFakeApp())
        .post('/organisations/org1/adduser')
        .set('Cookie', [fakeAuthorisedCookie])
        .type('form')
        .send({
          ...mockAddUserData,
        })
        .expect(403);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(setUpFakeApp(), '/organisations/org1/adduser', fakeAuthorisedCookie);

      return request(setUpFakeApp())
        .post('/organisations/:orgId/adduser')
        .type('form')
        .set('Cookie', [cookies])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('http://identity-server/login');
        });
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(setUpFakeApp(), '/organisations/org1/adduser', fakeAuthorisedCookie);

      const mockUnauthorisedJwtPayload = JSON.stringify({
        id: '88421113', name: 'Cool Dude',
      });
      const fakeUnauthorisedCookie = `fakeToken=${mockUnauthorisedJwtPayload}`;

      return request(setUpFakeApp())
        .post('/organisations/:orgId/adduser')
        .type('form')
        .set('Cookie', [cookies, fakeUnauthorisedCookie])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
          expect(res.text.includes('Not authorised')).toEqual(true);
        });
    });

    it('should return the correct status and text if response.success is true', async () => {
      addUserController.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: true }));

      const { cookies, csrfToken } = await getCsrfTokenFromGet(setUpFakeApp(), '/organisations/org1/adduser', fakeAuthorisedCookie);

      return request(setUpFakeApp())
        .post('/organisations/org1/adduser')
        .type('form')
        .set('Cookie', [cookies, fakeAuthorisedCookie])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/org1/adduser/confirmation');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should return the correct status and text if response.success is false', async () => {
      addUserController.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: false }));
      // TODO: Implement with errors
      // addUserController.getAddUserPageErrorContext = jest.fn()
      // .mockImplementation(() => Promise.resolve(mockAddUserErrorContext));
      const { cookies, csrfToken } = await getCsrfTokenFromGet(setUpFakeApp(), '/organisations/org1/adduser', fakeAuthorisedCookie);

      return request(setUpFakeApp())
        .post('/organisations/:orgId/adduser')
        .type('form')
        .set('Cookie', [cookies, fakeAuthorisedCookie])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(200)
        .then((res) => {
          expect(res.text).toEqual('Error adding user');
          // expect(res.text.includes('')).toEqual(true);
        // expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        // addUserController.getAddUserPageErrorContext.mockReset();
        });
    });
  });

  describe('GET *', () => {
    it('should return error page if url cannot be matched', () => (
      request(setUpFakeApp())
        .get('/aaaa')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url /aaaa - please check it is valid and try again</h1>')).toEqual(true);
        })));
  });
});

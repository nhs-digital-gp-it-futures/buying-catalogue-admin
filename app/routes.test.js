import request from 'supertest';
import { App } from './app';
import { routes } from './routes';
import { FakeAuthProvider } from './test-utils/FakeAuthProvider';
import { getCsrfTokenFromGet, setFakeCookie } from './test-utils/helper';
import * as orgDashboardContext from './pages/dashboard/controller';
import * as addUserContext from './pages/adduser/controller';
import * as userStatusContext from './pages/viewuser/changeUserStatusConfirmation/controller';
import * as editOrgConfirmationContext from './pages/editorg/confirmation/controller';
import * as addOrgContext from './pages/addorg/controller';

jest.mock('./logger');

jest.mock('./apiProvider', () => ({
  getData: jest.fn()
    .mockImplementation(() => Promise.resolve({})),
  postData: jest.fn()
    .mockImplementation(() => Promise.resolve({ success: true })),
  putData: jest.fn()
    .mockImplementation(() => Promise.resolve({ success: true })),
}));

const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));

addUserContext.postAddUser = jest.fn()
  .mockImplementation(() => Promise.resolve({ success: true }));

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
    const path = '/organisations';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="organisations"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      }));
  });

  describe('GET /organisations/addorganisation', () => {
    const path = '/organisations/addorganisation';

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
          expect(res.text.includes('data-test-id="add-org-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:organisationId', () => {
    const path = '/organisations/org1';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="org-page-title"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      }));
  });

  describe('POST /organisations/:organisationId/edit', () => {
    const path = '/organisations/org1/edit';

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
          expect(res.headers.location).toEqual('/organisations/org1/edit/confirmation');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:organisationId/edit', () => {
    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn('/organisations/org1/edit')
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim('/organisations/org1/edit')
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get('/organisations/org1/edit')
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="edit-organisation-page"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      }));
  });

  describe('GET /organisations/:organisationId/edit/confirmation', () => {
    const path = '/organisations/org1/edit/confirmation';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      editOrgConfirmationContext.getEditOrgConfirmationContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'edit-org-confirmation' }));

      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="edit-org-confirmation-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:organisationId/:userId', () => {
    const path = '/organisations/org1/user1';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="view-user-page"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      }));
  });

  describe('GET /organisations/:organisationId/:userId/enable', () => {
    const path = '/organisations/org1/user1/enable';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      userStatusContext.getUserStatusContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'mock-confirmation' }));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="mock-confirmation-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/:organisationId/:userId/enable', () => {
    const path = '/organisations/org1/user2/enable';
    const csrfPagePath = '/organisations/org1/user2';

    it('should return 403 forbidden if no csrf token is available', async () => {
      await checkForbiddenNoCsrf(path);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      await checkRedirectToLogin(csrfPagePath, path);
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      await checkLoggedInNotAuthorised(csrfPagePath, path);
    });

    it('should return the correct status and text if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), csrfPagePath, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/org1/user2/enable');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:organisationId/:userId/disable', () => {
    const path = '/organisations/org1/user1/disable';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      userStatusContext.getUserStatusContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'mock-confirmation' }));
      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="mock-confirmation-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('POST /organisations/:organisationId/:userId/disable', () => {
    const path = '/organisations/org1/user2/disable';
    const csrfPagePath = '/organisations/org1/user2';

    it('should return 403 forbidden if no csrf token is available', async () => {
      await checkForbiddenNoCsrf(path);
    });

    it('should redirect to the login page if the user is not logged in', async () => {
      await checkRedirectToLogin(csrfPagePath, path);
    });

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', async () => {
      await checkLoggedInNotAuthorised(csrfPagePath, path);
    });

    it('should return the correct status and text if response.success is true', async () => {
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), csrfPagePath, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({ _csrf: csrfToken })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/org1/user2/disable');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:organisationId/adduser', () => {
    const path = '/organisations/org1/adduser';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => request(setUpFakeApp())
      .get(path)
      .set('Cookie', [mockAuthorisedCookie])
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="add-user-page"')).toEqual(true);
      }));
  });

  describe('POST /organisations/:organisationId/adduser', () => {
    const path = '/organisations/org1/adduser';

    afterEach(() => {
      addUserContext.postAddUser.mockReset();
    });

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
      addUserContext.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: true, id: 'user1' }));

      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(302)
        .then((res) => {
          expect(res.redirect).toEqual(true);
          expect(res.headers.location).toEqual('/organisations/org1/adduser/confirmation?id=user1');
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    it('should return the correct status and text if response.success is false', async () => {
      addUserContext.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: false }));

      addUserContext.getAddUserPageErrorContext = jest.fn()
        .mockImplementation(() => Promise.resolve({
          errors: [{ text: 'Last name too long', href: '#lastName' }],
        }));
      const { cookies, csrfToken } = await getCsrfTokenFromGet(
        setUpFakeApp(), path, mockAuthorisedCookie,
      );

      return request(setUpFakeApp())
        .post(path)
        .type('form')
        .set('Cookie', [cookies, mockAuthorisedCookie])
        .send({
          ...mockAddUserData,
          _csrf: csrfToken,
        })
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="add-user-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-summary"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
          addUserContext.getAddUserPageErrorContext.mockReset();
        });
    });
  });

  describe('GET /organisations/:organisationId/adduser/confirmation', () => {
    const path = '/organisations/org1/adduser/confirmation';

    it('should redirect to the login page if the user is not logged in', () => (
      checkAuthorisedRouteNotLoggedIn(path)
    ));

    it('should show the error page indicating the user is not authorised if the user is logged in but not authorised', () => (
      checkAuthorisedRouteWithoutClaim(path)
    ));

    it('should return the correct status and text when the user is authorised', () => {
      orgDashboardContext.getOrgDashboardContext = jest.fn()
        .mockImplementation(() => ({ dataTestId: 'add-user-confirmation' }));

      return request(setUpFakeApp())
        .get(path)
        .set('Cookie', [mockAuthorisedCookie])
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="add-user-confirmation-page"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET *', () => {
    it('should return error page if url cannot be matched', done => request(setUpFakeApp())
      .get('/aaaa')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url /aaaa - please check it is valid and try again</h1>')).toEqual(true);
        done();
      }));
  });
});

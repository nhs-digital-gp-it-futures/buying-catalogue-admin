import request from 'supertest';
import { App } from './app';
import { routes } from './routes';
import { FakeAuthProvider } from './test-utils/FakeAuthProvider';
import * as orgDashboardContext from './pages/dashboard/contextCreator';
import * as addUserController from './pages/adduser/controller';

jest.mock('./logger');

const setUpFakeApp = () => {
  const authProvider = new FakeAuthProvider();
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

  describe('GET /organisations', () => {
    it('should return the correct status and text', () => {
      orgDashboardContext.getOrgDashboardContext = jest.fn()
        .mockImplementation(() => {});

      return request(setUpFakeApp())
        .get('/organisations')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="organisations"')).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });
  });

  describe('GET /organisations/:orgId', () => {
    it('should return the correct status and text', () => (
      request(setUpFakeApp())
        .get('/organisations/org1')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="org-page-title"')).toEqual(true);
        })));
  });

  describe('GET /organisations/:orgId/adduser', () => {
    it('should return the correct status and text', () => (
      request(setUpFakeApp())
        .get('/organisations/org1/adduser')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="add-user-page"')).toEqual(true);
        })));
  });

  describe('POST /organisations/:orgId/adduser', () => {
    afterEach(() => {
      addUserController.postAddUser.mockReset();
    });

    it('should return the correct status and text if response.success is true', () => {
      addUserController.postAddUser = jest.fn()
        .mockImplementation(() => Promise.resolve({ success: true }));

      return request(setUpFakeApp())
        .post('/organisations/:orgId/adduser')
        .send(mockAddUserData)
        // TODO: Change to test redirect when confirmation page is done
        // .expect(302)
        .expect(200)
        .then((res) => {
          expect(res.text).toEqual('Confirmation page');
          // expect(res.redirect).toEqual(true);
          expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        });
    });

    // TODO: Implement with errors
    // it('should return the correct status and text if response.success is false', () => {
    //   addUserController.postAddUser = jest.fn()
    //     .mockImplementation(() => Promise.resolve());
    //   addUserController.getAddUserPageErrorContext = jest.fn()
    //     .mockImplementation(() => Promise.resolve(mockAddUserErrorContext));
    //   const app = new App().createApp();
    //   app.use('/authority', routes);
    //   return request(app)
    //     .post('/organisations/:orgId/adduser')
    //     .send(mockAddUserData)
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.text.includes('')).toEqual(true);
    //       expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
    //       addUserController.getAddUserPageErrorContext.mockReset();
    //     });
    // });
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

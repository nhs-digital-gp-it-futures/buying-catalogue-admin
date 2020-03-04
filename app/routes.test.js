import request from 'supertest';
import { App } from './app';
import { routes } from './routes';
import { FakeAuthProvider } from './test-utils/FakeAuthProvider';
import * as orgDashboardContext from './pages/dashboard/contextCreator';

jest.mock('./logger');

const setUpFakeApp = () => {
  const authProvider = new FakeAuthProvider();
  const app = new App(authProvider).createApp();
  app.use('/', routes(authProvider));
  return app;
};

describe('routes', () => {
  describe('GET /health/live', () => {
    it('should return the correct status and text', () => {
      return request(setUpFakeApp())
        .get('/health/live')
        .expect(200)
        .then((res) => {
          expect(res.text).toBe('Buying Catalogue Admin app is running!');
        });
    });
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
    it('should return the correct status and text', () => {
      return request(setUpFakeApp())
        .get('/organisations/org1')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="org-page-title"')).toEqual(true);
        });
    });
  });

  describe('GET /organisations/:orgId/adduser', () => {
    it('should return the correct status and text', () => {
      return request(setUpFakeApp())
        .get('/organisations/org1/adduser')
        .expect(200)
        .then((res) => {
          expect(res.text).toEqual('create user account');
        });
    });
  });

  describe('GET *', () => {
    it('should return error page if url cannot be matched', () => {
      return request(setUpFakeApp())
        .get('/aaaa')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url /aaaa - please check it is valid and try again</h1>')).toEqual(true);
        });
    });
  });
});

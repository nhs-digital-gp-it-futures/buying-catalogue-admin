import request from 'supertest';
import { App } from '../app';
import routes from './routes';
import * as orgDashboardContext from './pages/dashboard/contextCreator';

jest.mock('./logger');

describe('routes', () => {
  describe('GET /health/live', () => {
    it('should return the correct status and text', () => {
      const app = new App().createApp();
      app.use('/', routes);

      return request(app)
        .get('/health/live')
        .expect(200)
        .then((res) => {
          expect(res.text).toBe('Buying Catalogue Admin app is running!');
        });
    });
  });

  describe('GET /organisations', () => {
    it('should return the correct status and text', () => {
      orgDashboardContext.getOrgDashboardContext = jest.fn()
        .mockImplementation(() => {});
      const app = new App().createApp();
      app.use('/', routes);

      return request(app)
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
      const app = new App().createApp();
      app.use('/', routes);

      return request(app)
        .get('/organisations/org1')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('data-test-id="org-page-title"')).toEqual(true);
        });
    });
  });

  describe('GET /organisations/:orgId/adduser', () => {
    it('should return the correct status and text', () => {
      const app = new App().createApp();
      app.use('/', routes);

      return request(app)
        .get('/organisations/org1/adduser')
        .expect(200)
        .then((res) => {
          expect(res.text).toEqual('create user account');
        });
    });
  });

  describe('GET *', () => {
    it('should return error page if url cannot be matched', () => {
      const app = new App().createApp();
      app.use('/', routes);
      return request(app)
        .get('/aaaa')
        .expect(200)
        .then((res) => {
          expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url /aaaa - please check it is valid and try again</h1>')).toEqual(true);
        });
    });
  });
});

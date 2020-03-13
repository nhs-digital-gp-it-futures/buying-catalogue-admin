const cookieParser = require('cookie-parser');

export class FakeAuthProvider {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(fakeLogoutMethod = () => {}) {
    this.fakeLogout = fakeLogoutMethod;
  }

  // eslint-disable-next-line class-methods-use-this
  setup(app) {
    app.use(cookieParser());

    app.use((req, res, next) => {
      if (req.cookies && req.cookies.fakeToken) {
        req.user = JSON.parse(req.cookies.fakeToken);
      }
      req.logout = this.fakeLogout;
      next();
    });
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  login() {
    return (req, res) => {
      res.redirect('http://identity-server/login');
    };
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  loginCallback() {
    return (req, res) => {
      res.redirect('/');
    };
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    return '/signout-callback-oidc';
  }
}
const cookieParser = require('cookie-parser');

export class FakeAuthProvider {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor() {}

  // eslint-disable-next-line class-methods-use-this
  setup(app) {
    app.use(cookieParser());

    app.use((req, res, next) => {
      if (req.cookies && req.cookies.fakeToken) {
        req.user = JSON.parse(req.cookies.fakeToken);
      }
      next();
    });
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  authenticate(options) {
    return (req, res) => {
      res.redirect('http://identity-server/login');
    };
  }
}

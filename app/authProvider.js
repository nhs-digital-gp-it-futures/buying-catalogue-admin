import passport from 'passport';
import PassportClient from 'passport-openidconnect';
import session from 'cookie-session';
import {
  oidcBaseUri, oidcClientId, oidcClientSecret, appBaseUri,
} from './config';

export class AuthProvider {
  constructor() {
    this.passport = passport;

    this.passport.use(new PassportClient.Strategy({
      issuer: oidcBaseUri,
      clientID: oidcClientId,
      clientSecret: oidcClientSecret,
      authorizationURL: `${oidcBaseUri}/connect/authorize`,
      userInfoURL: `${oidcBaseUri}/connect/userinfo`,
      tokenURL: `${oidcBaseUri}/connect/token`,
      callbackURL: `${appBaseUri}/oauth/callback`,
      passReqToCallback: true,
    },
    ((req, issuer, userId, profile, accessToken, refreshToken, params, cb) => {
      req.session.accessToken = accessToken;

      return cb(null, profile);
    })));

    this.passport.serializeUser((user, done) => {
      done(null, user);
    });

    this.passport.deserializeUser((obj, done) => {
      done(null, obj);
    });
  }

  setup(app) {
    app.use(session({
      name: 'token2',
      secret: 'secret squirrel',
    }));

    app.use(this.passport.initialize());
    app.use(this.passport.session());
  }

  authenticate(options) {
    return (req, res, next) => {
      this.passport.authenticate('openidconnect', options)(req, res, next);
    };
  }
}

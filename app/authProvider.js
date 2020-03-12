import url from 'url';
import passport from 'passport';
import { Strategy, Issuer } from 'openid-client';
import session from 'cookie-session';
import {
  oidcBaseUri, oidcClientId, oidcClientSecret, appBaseUri,
} from './config';

export class AuthProvider {
  constructor() {
    this.passport = passport;

    Issuer.discover(oidcBaseUri)
      .then((issuer) => {
        this.client = new issuer.Client({
          client_id: oidcClientId,
          client_secret: oidcClientSecret,
        });

        const params = {
          client_id: oidcClientId,
          redirect_uri: `${appBaseUri}/oauth/callback`,
          scope: 'openid profile',
        };

        const passReqToCallback = true;

        const usePKCE = 'S256';

        this.passport.use('oidc', new Strategy({
          client: this.client, params, passReqToCallback, usePKCE,
        }, (req, tokenset, userinfo, done) => {
          req.session.accessToken = tokenset;
          this.id_token = tokenset.id_token;

          return done(null, userinfo);
        }));
      });

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

  login() {
    return (req, res, next) => {
      const options = {
        state: url.parse(req.headers.referer).pathname,
      };
      this.passport.authenticate('oidc', options)(req, res, next);
    };
  }

  loginCallback() {
    return (req, res, next) => {
      const redirectUrl = req.query.state;
      const optionsWithUrl = {
        callback: true,
        failureRedirect: '/',
        successReturnToOrRedirect: redirectUrl,
      };

      this.passport.authenticate('oidc', optionsWithUrl)(req, res, next);
    };
  }

  logout() {
    return this.client.endSessionUrl({
      id_token_hint: this.id_token,
      post_logout_redirect_uri: `${appBaseUri}/signout-callback-oidc`,
    });
  }
}

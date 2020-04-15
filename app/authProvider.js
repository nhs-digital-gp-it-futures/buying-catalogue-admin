import url from 'url';
import passport from 'passport';
import { Strategy, Issuer } from 'openid-client';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import config from 'config';

export class AuthProvider {
  constructor() {
    this.passport = passport;

    Issuer.discover(config.oidcBaseUri)
      .then((issuer) => {
        this.client = new issuer.Client({
          client_id: config.oidcClientId,
          client_secret: config.oidcClientSecret,
        });

        const params = {
          client_id: config.oidcClientId,
          redirect_uri: `${config.appBaseUri}${config.baseUrl}/oauth/callback`,
          scope: 'openid profile Organisation',
        };

        const passReqToCallback = true;

        const usePKCE = 'S256';

        this.passport.use('oidc', new Strategy({
          client: this.client,
          params,
          passReqToCallback,
          usePKCE,
        },
        (req, tokenset, userinfo, done) => {
          req.session.accessToken = tokenset;

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
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient(config.redisUrl);

    app.use(session({
      store: new RedisStore({ client: redisClient }),
      name: 'token',
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: true,
      maxAge: config.maxCookieAge,
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

  logout({ idToken }) {
    return this.client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: `${config.appBaseUri}${config.baseUrl}/signout-callback-oidc`,
    });
  }

  authorise() {
    return (req, res, next) => {
      if (!req.user) {
        req.headers.referer = `${req.originalUrl}`;
        this.login()(req, res, next);
      } else if (req.user && req.user.organisation) {
        next();
      } else {
        throw new Error('Not authorised matey');
      }
    };
  }
}

export const withCatch = route => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    return next(err);
  }
};

export const extractAccessToken = req => req.session
  && req.session.accessToken && req.session.accessToken.access_token;

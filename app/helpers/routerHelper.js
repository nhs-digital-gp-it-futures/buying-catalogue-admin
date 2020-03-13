export const withCatch = route => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    return next(err);
  }
};

export const extractAccessToken = ({ req, tokenType }) => req.session
  && req.session.accessToken && req.session.accessToken[`${tokenType}_token`];

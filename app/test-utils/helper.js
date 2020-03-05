import cheerio from 'cheerio';
import request from 'supertest';

export const extractInnerText = async (element) => {
  const elementInnerText = await element.innerText;
  return elementInnerText.trim();
};

const extractCsrfToken = (res) => {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
};

export const getCsrfTokenFromGet = async (app, getPath) => {
  let cookies;
  let csrfToken;

  await request(app)
    .get(getPath)
    .then((getRes) => {
      cookies = getRes.headers['set-cookie'];
      csrfToken = extractCsrfToken(getRes);
    });
  return { cookies, csrfToken };
};

import nunjucks from 'nunjucks';
import cheerio from 'cheerio';
import { createTestHarness } from 'buying-catalogue-library';
import { App } from '../app';
import config from '../config';

export const componentTester = (setup, callback) => (done) => {
  const app = new App().createApp();

  callback(createTestHarness({
    app,
    templateEngine: nunjucks,
    config,
    setup,
    done,
  }));
};

export const snapshotTest = ($, id) => {
  const element = $(id);
  const html = cheerio.html($.root().html(element));

  return html;
};

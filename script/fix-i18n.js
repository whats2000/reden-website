// read from ./i18n/zh-CN.json, remove all empty values, and write to ./i18n/zh-CN.json

import fs from 'fs';
import path from 'path';

function fixI18n(lang) {
  const i18nPath = path.resolve(`../i18n/${lang}.json`);
  const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));

  function removeEmptyValues(obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        removeEmptyValues(obj[key]);
      } else if (obj[key] === '') {
        delete obj[key];
      }
    });
  }

  removeEmptyValues(i18n);
  removeEmptyValues(i18n);
  // leave a blank line at the end
  fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2) + '\n');
}

fixI18n('zh_CN');
fixI18n('zh_TW');
fixI18n('ru_RU');
fixI18n('en');

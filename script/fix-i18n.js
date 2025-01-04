// read from ./i18n/zh-CN.json, remove all empty values, and write to ./i18n/zh-CN.json

import fs from 'fs';
import path from 'path';

function fixI18n(lang) {
  const i18nPath = path.resolve(`../i18n/${lang}.json`);
  const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));

  function removeEmptyValues(obj) {
    if (typeof obj !== 'object') {
      return obj;
    }
    const sorted = {};
    Object.keys(obj)
      .toSorted()
      .forEach((key) => {
        if (typeof obj[key] === 'object') {
          if (obj[key] && Object.keys(obj[key]).length === 0) {
            return;
          }
        } else if (obj[key] === '') {
          return;
        }
        sorted[key] = removeEmptyValues(obj[key]);
      });
    return sorted;
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

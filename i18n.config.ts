import en from '@/i18n/en.json';
import zh_cn from '@/i18n/zh_CN.json';
import zh_tw from '@/i18n/zh_TW.json';
import ru from '@/i18n/ru_RU.json';

export const localeToIso: Record<string, string> = {
  en: 'en',
  zh_cn: 'zh-CN',
  zh_tw: 'zh-TW',
  ru: 'ru',
};

const messages = {
  en,
  zh_cn,
  zh_tw,
  ru,
};
export default defineI18nConfig(() => ({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  fallbackLocale: 'en',
  messages,
}));

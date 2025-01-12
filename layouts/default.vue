<script lang="ts" setup>
import { VSonner } from 'vuetify-sonner';
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '~/store/app';
import '@/assets/main.css';
import { localeToIso } from '~/i18n.config';
import LayoutHeader from '~/components/layout/Header.vue';
import LayoutFooter from '~/components/layout/footer.vue';

const themeCookie = useCookie<'light' | 'dark'>('theme', {
  default: () => 'light',
});

const theme = useTheme();
const appStore = useAppStore();
const switchLocalePath = useSwitchLocalePath();
appStore.theme = themeCookie.value;
onMounted(() => {
  const colors: Record<string, string> =
    theme.themes.value[appStore.theme]!.colors;
  const css: string[] = [];
  let themeText = `theme: ${theme.name.value} app: ${appStore.theme} cookie: ${themeCookie.value}\n`;
  for (const key in colors) {
    themeText += `%c ${key} %c${colors[key]}`;
    css.push('color:unset;');
    css.push(`background:${colors[key]}`);
  }
  console.log(themeText, ...css);
});
onPrehydrate(() => {
  const background: Record<string, string> = {
    dark: '#121212',
    light: '#ffffff',
  };
  const themeCookie =
    document.cookie
      ?.split(';')
      ?.find((cookie) => cookie.includes('theme='))
      ?.replace('theme=', '')
      ?.replace(' ', '') || 'light';
  console.log('onPreHydrate', document.cookie, themeCookie);
  // set body background color
  document.body.style.backgroundColor = background[themeCookie];
});

function toggleTheme() {
  appStore.theme = appStore.theme === 'light' ? 'dark' : 'light';
  themeCookie.value = appStore.theme;
  if (import.meta.client) {
    document.body.style.backgroundColor =
      theme.themes.value[appStore.theme]!.colors.background;
  }
  appStore.save();
}

const { locale } = useI18n();
</script>

<template>
  <Html :lang="localeToIso[locale]">
    <Head>
      <template
        v-for="[targetLocale, isoCode] in Object.entries(localeToIso)"
        :key="isoCode"
      >
        <Link
          v-if="locale !== targetLocale"
          :href="switchLocalePath(targetLocale)"
          :hreflang="isoCode"
          rel="alternate"
        />
      </template>
    </Head>
  </Html>
  <v-app :theme="appStore.theme">
    <layout-header>
      <template #common-append>
        <v-btn
          :icon="
            appStore.theme === 'light'
              ? 'mdi-weather-night'
              : 'mdi-weather-sunny'
          "
          title="Toggle Theme"
          @click="toggleTheme"
        />
      </template>
    </layout-header>

    <VSonner :expand="true" :position="'top-right'" />
    <v-main class="router">
      <slot />
    </v-main>

    <layout-footer />
  </v-app>
</template>

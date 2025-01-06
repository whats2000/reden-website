<script lang="ts" setup>
import { VSonner } from 'vuetify-sonner';
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '~/store/app';
import '@/assets/main.css';
import type { I18nHeadMetaInfo } from '@nuxtjs/i18n';

const themeCookie = useCookie<'light' | 'dark'>('theme', {
  default: () => 'light',
});

const theme = useTheme();
const appStore = useAppStore();
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
      .split(';')
      .find((cookie) => {
        return cookie.includes('theme=');
      })
      ?.replace('theme=', '')
      ?.replace(' ', '') || 'light';
  console.log('onPrehydrate', document.cookie, themeCookie);
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

const i18nHead: Ref<I18nHeadMetaInfo> = useLocaleHead({
  seo: { canonicalQueries: [''] },
});
watch(i18nHead, (value) => {
  console.log('i18nHead', value);
});
</script>

<template>
  <Html :lang="i18nHead.htmlAttrs?.lang">
    <Head>
      <template v-for="link in i18nHead.link" :key="link.hid">
        <Link
          :id="link.hid"
          :href="link.href"
          :hreflang="link.hreflang"
          :rel="link.rel"
        />
      </template>
      <template v-for="meta in i18nHead.meta" :key="meta.hid">
        <Meta
          :id="meta.hid"
          :content="meta.content"
          :property="meta.property"
        />
      </template>
    </Head>
    <!--    <Body :style="`background-color: ${currentTheme.colors.background}`" />-->
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

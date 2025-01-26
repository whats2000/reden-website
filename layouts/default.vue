<script lang="ts" setup>
import '@mdi/font/css/materialdesignicons.css';
import { VSonner } from 'vuetify-sonner';
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '~/store/app';
import '@/assets/main.css';
import LayoutHeader from '~/components/layout/Header.vue';
import LayoutFooter from '~/components/layout/footer.vue';

const theme = useTheme();
const appStore = useAppStore();
watch(
  () => appStore.theme,
  () => {
    console.log('[layouts/default] theme changed', appStore.theme);
    document.body.style.backgroundColor =
      theme.themes.value[appStore.theme]!.colors.background;
  },
  { immediate: true },
);
onMounted(() => {
  const colors: Record<string, string> =
    theme.themes.value[appStore.theme]!.colors;
  const css: string[] = [];
  let themeText = `[onMounted layouts/default] theme: ${theme.name.value} app: ${appStore.theme}\n`;
  for (const key in colors) {
    themeText += `%c ${key} %c${colors[key]}`;
    css.push('color:unset;');
    css.push(`background:${colors[key]}`);
  }
  console.log(themeText, ...css);
});
// onPrehydrate(() => {
//   const background: Record<string, string> = {
//     dark: '#121212',
//     light: '#ffffff',
//   };
//   const themeCookie =
//     document.cookie
//       ?.split(';')
//       ?.find((cookie) => cookie.includes('theme='))
//       ?.replace('theme=', '')
//       ?.replace(' ', '') || 'light';
//   console.log('onPreHydrate', document.cookie, themeCookie);
//   // set body background color
//   document.body.style.backgroundColor = background[themeCookie];
// });

function toggleTheme() {
  appStore.theme = appStore.theme === 'light' ? 'dark' : 'light';
  if (import.meta.client) {
    document.body.style.backgroundColor =
      theme.themes.value[appStore.theme]!.colors.background;
  }
  appStore.save();
}

const localeHead = useLocaleHead({
  addSeoAttributes: {
    canonicalQueries: ['page', 'q'],
  },
});
</script>

<template>
  <Html :lang="localeHead.htmlAttrs.lang">
    <Head>
      <template v-for="link in localeHead.link" :key="link.hid">
        <Link
          :id="link.hid"
          :href="link.href"
          :hreflang="link.hreflang"
          :rel="link.rel"
        />
      </template>
      <template v-for="meta in localeHead.meta" :key="meta.hid">
        <Meta
          :id="meta.hid"
          :content="meta.content"
          :property="meta.property"
        />
      </template>
    </Head>
  </Html>
  <v-app :theme="appStore.theme">
    <layout-header>
      <template #desktop-append>
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
      <template #mobile-menu-append>
        <v-list-item
          :prepend-icon="
            appStore.theme === 'light'
              ? 'mdi-weather-night'
              : 'mdi-weather-sunny'
          "
          @click="toggleTheme"
        >
          <v-list-item-title>
            {{ appStore.theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </layout-header>

    <VSonner :expand="true" :position="'top-right'" />
    <v-main class="router" style="--v-layout-top: 64px">
      <slot />
    </v-main>

    <layout-footer />
  </v-app>
</template>

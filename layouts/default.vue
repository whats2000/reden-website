<script lang="ts" setup>
import { VSonner } from 'vuetify-sonner';
import { discordInvite, githubLink, zh_cn } from '@/utils/constants';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay, useTheme } from 'vuetify';
import { useAppStore } from '~/store/app';
import '@/assets/main.css';
import type { I18nHeadMetaInfo } from '@nuxtjs/i18n';

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const theme = useTheme();
const currentTheme = computed(() => theme.current.value);
const appStore = useAppStore();
onMounted(() => {
  // set body background color
  const colors: Record<string, string> =
    theme.themes.value[appStore.theme]!.colors;
  const css: string[] = [];
  let themeText = `theme: ${theme.name.value}\n`;
  for (const key in colors) {
    themeText += `%c${key} %c${colors[key]}`;
    css.push('color:unset;');
    css.push(`background:${colors[key]}`);
  }
  console.log(themeText, ...css);
});
watch(currentTheme, (theme) => {
  document.body.style.backgroundColor = theme.colors.background;
  console.log(document.body.style.backgroundColor);
});

const { locale } = useI18n();

const { mobile } = useDisplay({
  mobileBreakpoint: 500,
});

function toggleTheme() {
  appStore.theme = appStore.theme === 'light' ? 'dark' : 'light';
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
    <Body :style="`background-color: ${currentTheme.colors.background}`" />
  </Html>
  <v-app :theme="appStore.theme">
    <v-app-bar :elevation="2" class="reden-app-bar" color="transparent">
      <template #prepend>
        <template v-if="mobile">
          <v-btn v-show="mobile" icon="mdi-menu" title="Menu">
            <v-icon>mdi-menu</v-icon>
            <v-menu :close-on-content-click="true" activator="parent">
              <v-list class="w-100 router">
                <v-list-item :to="localePath('/')">
                  <template #prepend>
                    <v-icon>mdi-home</v-icon>
                  </template>
                  <v-list-item-title> Home</v-list-item-title>
                </v-list-item>
                <v-list-item :to="localePath('/feature')">
                  <template #prepend>
                    <v-icon>mdi-view-dashboard</v-icon>
                  </template>
                  <v-list-item-title> Features</v-list-item-title>
                </v-list-item>
                <v-divider />
                <template v-if="useAppStore().logined">
                  <reden-router :to="localePath('/home')">
                    <v-list-item link>
                      <template #prepend>
                        <v-avatar
                          v-if="useAppStore().userCache?.avatarUrl"
                          :image="useAppStore().userCache?.avatarUrl"
                          :size="40"
                        />
                        <v-icon v-else> mdi-account</v-icon>
                      </template>
                      <v-list-item-title> My Profile</v-list-item-title>
                    </v-list-item>
                  </reden-router>
                  <v-list-item>
                    <v-list-item-title> My Machines</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title> My Stars</v-list-item-title>
                  </v-list-item>
                </template>
                <template v-else>
                  <reden-router :to="localePath('/login')">
                    <v-list-item link>
                      <template #prepend>
                        <v-icon>mdi-account</v-icon>
                      </template>
                      <v-list-item-title> Login</v-list-item-title>
                    </v-list-item>
                  </reden-router>

                  <reden-router :to="localePath('/register')">
                    <v-list-item link>
                      <template #prepend>
                        <v-icon>mdi-account-plus</v-icon>
                      </template>
                      <v-list-item-title> Register</v-list-item-title>
                    </v-list-item>
                  </reden-router>
                </template>
                <template v-if="useAppStore().userCache?.isStaff">
                  <v-divider />
                  <reden-router :to="localePath('/admin')">
                    <v-list-item link>
                      <template #prepend>
                        <v-icon>mdi-cog</v-icon>
                      </template>
                      <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item>
                  </reden-router>
                </template>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
        <template v-else>
          <v-btn :active="false" :to="localePath('/')" stacked title="Homepage">
            <v-img src="/reden_256.png" width="36" />
          </v-btn>
          <v-btn
            v-if="useAppStore().userCache?.isStaff"
            :to="localePath('/admin')"
            prepend-icon="mdi-cog"
            stacked
            title="Admin"
          >
            Admin
          </v-btn>
        </template>
      </template>
      <p class="text-h5"></p>
      <template #append>
        <v-btn
          v-show="!mobile"
          :href="githubLink"
          icon="mdi-github"
          title="Github"
        />

        <v-btn
          v-show="!mobile"
          :href="discordInvite"
          icon="custom:DiscordIcon"
          title="Discord"
        />

        <v-btn
          :icon="
            appStore.theme === 'light'
              ? 'mdi-weather-night'
              : 'mdi-weather-sunny'
          "
          title="Toggle Theme"
          @click="toggleTheme"
        />
        <v-btn icon="mdi-translate" title="Language">
          <v-icon icon="mdi-translate" />
          <v-menu :close-on-content-click="true" activator="parent">
            <v-list>
              <v-list-item
                v-for="locale in $i18n.availableLocales"
                :key="`locale-${locale}`"
                :to="switchLocalePath(locale)"
              >
                <v-list-item-title>{{ $t(locale) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn
          :to="localePath(useAppStore().logined ? '/home' : '/login')"
          icon="mdi-account"
          title="Account"
        />
      </template>
    </v-app-bar>

    <VSonner :expand="true" :position="'top-right'" />
    <v-main class="router">
      <slot />
    </v-main>

    <layout-footer />
  </v-app>
</template>

<style scoped>
.footer-list-title {
  margin-top: 8px;
  margin-bottom: 8px;
  min-width: 200px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}

.footer-list-item {
  margin-bottom: 8px;
}

.last-line {
  width: 100%;
}

.bottom-right {
  font-size: 0.7em;
  opacity: 0.7;
  padding: 6px;
}

.reden-app-bar {
  backdrop-filter: blur(10px);
}
</style>

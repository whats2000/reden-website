<script lang="ts" setup>
import { ref } from 'vue';
import RedStoneSection from '@/components/RedStoneSection.vue';
import RedstoneSectionTitle from '@/components/RedstoneSectionTitle.vue';
import Feature from '@/pages/feature/index.vue';
import {
  discordInvite,
  doFetchGet,
  githubLink,
  toastError,
} from '@/utils/constants';
import '@/assets/main.css';
import { useBackendMeta } from '~/store/meta';
import { toast } from 'vuetify-sonner';
import { useAppStore } from '~/store/app';

const appStore = useAppStore();
const introContent = ref<HTMLElement | null>(null);
const localePath = useLocalePath();

const { t } = useI18n();
useHead({
  title: t('reden.title.home_full'),
  titleTemplate: '%s - Reden',
});
console.log(document?.title, t('reden.title.home_full'));
useSeoMeta({
  description: t('reden.description'),
});

const backendInfo = useBackendMeta();
</script>

<template>
  <div v-if="backendInfo.developmentMode">
    <v-alert closable close-label="关闭" icon="mdi-alert">
      <v-alert-title> 开发模式选项</v-alert-title>
      <v-btn
        color="primary"
        @click="
          doFetchGet('/api/account/login-test-account').then((res) => {
            if (res.ok) {
              appStore.login('test', 1);
              toast.success('登录成功');
            } else {
              toastError(res);
            }
          })
        "
      >
        登录测试账号
      </v-btn>
    </v-alert>
  </div>
  <div class="main-page">
    <div>
      <v-row>
        <v-col>
          <h1 class="text-h2 text-md-h1 font-weight-bold">Reden</h1>
          <p class="opacity-80 text-h5">
            {{ $t('reden.description') }}
          </p>
        </v-col>
        <v-col class="icon" cols="3">
          <v-img class="d-none d-sm-block" src="/reden_256.png" width="148" />
        </v-col>
      </v-row>
      <div class="d-flex buttons">
        <v-btn
          :to="localePath('/litematica')"
          class="ma-2 text-none"
          color="primary"
          prepend-icon="mdi-download"
          rounded="rounded"
          size="x-large"
        >
          {{ t('reden.home.go_litematica') }}
        </v-btn>
        <v-btn
          :href="githubLink"
          class="ma-2"
          prepend-icon="mdi-github"
          rounded="rounded"
          size="x-large"
          variant="outlined"
        >
          Github
        </v-btn>
        <v-btn
          class="ma-2"
          href="https://wiki.redenmc.com"
          prepend-icon="mdi-book-open"
          rounded="rounded"
          size="x-large"
          variant="outlined"
        >
          {{ $t('reden.wiki') }}
        </v-btn>
      </div>
    </div>
  </div>
  <div class="d-flex flex-wrap">
    <v-col cols="12" md="6">
      <v-card
        style="
          background: linear-gradient(135deg, #dd8833, #ffbb33);
          height: 400px;
        "
      >
        <v-card-title class="text-h3 text-sm-h2 font-weight-bold">
          探索红石机器
        </v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card
        style="
          background: linear-gradient(135deg, #33b5e5, #0099cc);
          height: 400px;
        "
      >
        <v-card-title class="text-h3 text-sm-h2 font-weight-bold">
          关注最爱的作者
        </v-card-title>
      </v-card>
    </v-col>
  </div>

  <div ref="introContent" class="intro-content">
    <Feature />
    <div class="content-common">
      <v-row class="community-intro">
        <v-col>
          <v-card color="light-blue">
            <v-card-title>
              {{ $t('litematica_generator.title') }}
            </v-card-title>
            <v-card-text>
              {{ $t('litematica_generator.description') }}
            </v-card-text>
            <v-card-actions>
              <v-btn :to="localePath('/litematica')" color="White">Go</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card color="orange">
            <v-card-title>Github 同步</v-card-title>
            <v-card-text>
              绑定 GitHub Apps，同步机器、配置、你关注的仓库和创作者：你的世界！
            </v-card-text>
            <v-card-actions>
              <v-btn :to="localePath('/home')" color="White">点击前往</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <RedstoneSectionTitle :title="$t('reden.home.community_intro.title')">
        <template #default="{ leverOn }">
          <RedStoneSection :lever-on="leverOn" :size="3">
            <template #title> Open Source</template>
            <template #text>
              <p>
                {{ $t('reden.home.community_intro.open_source') }}
              </p>
            </template>
            <template #action>
              <v-btn
                :href="githubLink"
                class="ma-2"
                color="primary"
                rounded="rounded"
                variant="outlined"
              >
                Github
              </v-btn>
            </template>
          </RedStoneSection>
          <RedStoneSection :lever-on="leverOn" :size="3">
            <template #title> Sponsors</template>
            <template #text>
              <p>
                {{ $t('reden.home.community_intro.sponsor') }}
              </p>
            </template>
            <template #action>
              <v-btn
                :to="localePath('/sponsors')"
                class="ma-2"
                color="primary"
                rounded="rounded"
                variant="outlined"
              >
                Sponsors
              </v-btn>
            </template>
          </RedStoneSection>
          <RedStoneSection :lever-on="leverOn" :size="3">
            <template #title> Wiki</template>
            <template #text>
              <p>
                {{ $t('reden.home.community_intro.wiki') }}
              </p>
            </template>
            <template #action>
              <v-btn
                class="ma-2"
                color="primary"
                href="//wiki.redenmc.com"
                rounded="rounded"
                variant="outlined"
              >
                Wiki
              </v-btn>
            </template>
          </RedStoneSection>
          <RedStoneSection :lever-on="leverOn" :size="3">
            <template #title> Discord</template>
            <template #text>
              <p>
                {{ $t('reden.home.community_intro.discord') }}
              </p>
            </template>
            <template #action>
              <v-btn
                :href="discordInvite"
                class="ma-2"
                color="primary"
                rounded="rounded"
                variant="outlined"
              >
                Discord
              </v-btn>
            </template>
          </RedStoneSection>
        </template>
      </RedstoneSectionTitle>
    </div>
  </div>
</template>

<style scoped>
body {
  --side-padding: 16px;
}

.main-page {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 64px;
  height: 70vh;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 560px) {
    .icon {
      display: none;
    }
  }
}

.buttons {
  flex-direction: row;
  flex-wrap: wrap;

  @media (max-width: 400px) {
    flex-direction: column;
    margin: 0 auto;
    max-width: 240px;
  }
}

* {
  touch-action: manipulation;
}

.min-w-380 {
  min-width: 380px;
}
</style>

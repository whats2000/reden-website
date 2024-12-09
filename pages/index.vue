<script lang="ts" setup>
import { ref } from 'vue';
import RedStoneSection from '@/components/RedStoneSection.vue';
import RedstoneSectionTitle from '@/components/RedstoneSectionTitle.vue';
import Feature from '@/pages/feature/index.vue';
import { discordInvite, doFetchGet, githubLink } from '@/utils/constants';
import '@/assets/main.css';
import { useBackendMeta } from '~/store/meta';
import { toast } from 'vuetify-sonner';

const introContent = ref<HTMLElement | null>(null);
const localePath = useLocalePath();

const { t } = useI18n();
useSeoMeta({
  title: t('reden.title.home_full') + ' - Reden',
  description: t('reden.description'),
});

const backendInfo = useBackendMeta();
</script>

<template>
  <div v-if="backendInfo.developmentMode">
    <v-alert closable icon="mdi-alert">
      <template #title>
        <span>开发模式选项</span>
      </template>
      <template #text>
        <v-btn
          color="primary"
          @click="
            doFetchGet('/api/account/login-test-account').then(() =>
              toast('登录成功'),
            )
          "
        >
          登录测试账号
        </v-btn>
      </template>
    </v-alert>
  </div>
  <div class="main-page">
    <div>
      <v-row>
        <v-col>
          <h1 class="text-h2 font-weight-bold">Reden</h1>
          <p style="font-size: larger">
            {{ $t('reden.description') }}
          </p>
        </v-col>
        <v-col class="icon" cols="3">
          <v-img src="/reden_256.png" width="148" />
        </v-col>
      </v-row>
      <div class="buttons">
        <v-btn
          :to="localePath('/download')"
          class="main-button"
          color="primary"
          prepend-icon="mdi-download"
          rounded="rounded"
          size="x-large"
        >
          {{ $t('reden.download') }}
        </v-btn>
        <v-btn
          :href="githubLink"
          class="main-button"
          prepend-icon="mdi-github"
          rounded="rounded"
          size="x-large"
          variant="outlined"
        >
          Github
        </v-btn>
        <v-btn
          class="main-button"
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

  <div ref="introContent" class="intro-content">
    <Feature />
    <div class="community-intro content-common">
      <v-row>
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

      <RedstoneSectionTitle :title="$t('reden.home.community_intro.title')" />
      <RedStoneSection :size="3">
        <template #title> Open Source</template>
        <template #text>
          <p>
            {{ $t('reden.home.community_intro.open_source') }}
          </p>
        </template>
        <template #action>
          <v-btn
            :href="githubLink"
            class="main-button"
            color="primary"
            rounded="rounded"
            variant="outlined"
          >
            Github
          </v-btn>
        </template>
      </RedStoneSection>
      <RedStoneSection :size="3">
        <template #title> Sponsors</template>
        <template #text>
          <p>
            {{ $t('reden.home.community_intro.sponsor') }}
          </p>
        </template>
        <template #action>
          <v-btn
            :to="localePath('/sponsors')"
            class="main-button"
            color="primary"
            rounded="rounded"
            variant="outlined"
          >
            Sponsors
          </v-btn>
        </template>
      </RedStoneSection>
      <RedStoneSection :size="3">
        <template #title> Wiki</template>
        <template #text>
          <p>
            {{ $t('reden.home.community_intro.wiki') }}
          </p>
        </template>
        <template #action>
          <v-btn
            class="main-button"
            color="primary"
            href="//wiki.redenmc.com"
            rounded="rounded"
            variant="outlined"
          >
            Wiki
          </v-btn>
        </template>
      </RedStoneSection>
      <RedStoneSection :size="3">
        <template #title> Discord</template>
        <template #text>
          <p>
            {{ $t('reden.home.community_intro.discord') }}
          </p>
        </template>
        <template #action>
          <v-btn
            :href="discordInvite"
            class="main-button"
            color="primary"
            rounded="rounded"
            variant="outlined"
          >
            Discord
          </v-btn>
        </template>
      </RedStoneSection>
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
  height: calc(100vh - 120px);
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 750px) {
    .icon {
      display: none;
    }
  }
}

* {
  touch-action: manipulation;
}

.main-button {
  margin: 6px;
}

.v-col {
  min-width: 180px;
}
</style>

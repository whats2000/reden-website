<script lang="ts" setup>
import MinecraftFarmCard from '~/components/litematica/MinecraftFarmCard.vue';
import { useDisplay, useGoTo } from 'vuetify';
import SidebarAd from '~/components/ads/SidebarAd.vue';
import BottomBarAd from '~/components/ads/BottomBarAd.vue';

export type Tag = {
  tag: string;
  name: string;
  description: string;
};

export type MachineDef = {
  type: 'LitematicaGen' | 'LitematicaShare';
  name: string;
  key: string;
  downloads?: number;
  hasX?: boolean;
  hasY?: boolean;
  hasZ?: boolean;
  description?: string;
  summary?: string;
  link?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  updatedAt?: number;
  author?: Partial<Profile>;
  categoryTag?: Tag;
  featureTags?: Tag[];
  attachments?: string[];
};

const { t } = useI18n();
useSeoMeta({
  title: t('litematica_generator.title') + ' - Reden',
  ogTitle: t('litematica_generator.title') + ' - Reden',
  description: t('litematica_generator.og_description'),
  ogDescription: t('litematica_generator.og_description'),
  ogImage: 'https://redenmc.com/reden_256.png',
});
const goto = useGoTo({});
const localePath = useLocalePath();
const router = useRouter();
if (router.currentRoute.value.query.m) {
  router.push(localePath(`/litematica/${router.currentRoute.value.query.m}`));
}
const page = ref(1);
if (router.currentRoute.value.query.page) {
  page.value = Number(router.currentRoute.value.query.page);
}
watch(page, () => {
  goto(0);
  router.replace({
    query: {
      page: String(page.value),
    },
  });
});

export type Machine = MachineDef & {
  conditions: { [key: string]: ((v: number) => any)[] };
};
export type ListLitematicaResponse = {
  readonly d: Record<
    string,
    MachineDef & {
      conditions?: {
        x: string[];
        y: string[];
        z: string[];
      };
    }
  >;
  readonly downloads: number;
  readonly count: number;
};
const { locale } = useI18n();

const { data: serverResponse } = await useFetch<ListLitematicaResponse>(
  () =>
    `/api/mc-services/yisibite/?lang=${locale.value}&page=${Math.round(page.value)}`,
  {
    dedupe: 'defer',
    key: `generators${locale.value}`,
    headers: {
      Authorization: process.env.REDEN_API_TOKEN as string,
    },
  },
);

const items = computed<MachineDef[]>(() => {
  const items = [];
  for (const [, def] of Object.entries(serverResponse.value?.d ?? {}).sort(
    ([, a], [, b]) => (b.downloads ?? 0) - (a.downloads ?? 0),
  )) {
    items.push(def);
  }
  return items;
});

const isClient = import.meta.client;
const notification = ref(false);
const maintaining = false;
const { mdAndUp, xs, sm, md, width } = useDisplay({
  mobileBreakpoint: 600,
});
const itemsPerRow = computed(() =>
  xs.value ? 1 : sm.value || md.value ? 2 : 3,
);
const itemDisplay = computed(() => {
  const rows: { def?: MachineDef[]; ad?: 'ad' }[] = [];
  const rowCount = Math.ceil(items.value.length / itemsPerRow.value);
  for (let i = 0; i < rowCount; i++) {
    rows.push({
      def: items.value.slice(
        i * itemsPerRow.value,
        (i + 1) * itemsPerRow.value,
      ),
    });
    if (i % (6 / itemsPerRow.value) === 1) {
      rows.push({ ad: 'ad' });
    }
  }
  return rows;
});
</script>
<template>
  <div class="w-100 text-center opacity-60">
    广告位招租！
    如果您想借助本站的流量推广您的服务器、VPS出租或任何其他服务，请在微信
    Scanmenge 或 QQ 1284588550 联系我，注明来意。
  </div>
  <v-container class="pa-4" style="max-width: max-content">
    <v-alert
      v-if="maintaining && isClient && notification"
      class="mb-3"
      type="warning"
    >
      <template #title>
        <v-alert-title> 本生成器正在维护！</v-alert-title>
      </template>
      <template #text>
        投影生成器服务正在进行维护，进行数据和服务器迁移，以及代码重构。
        期间可能会有不稳定的情况，如果你遇到问题，请稍后重试。
        <br />
        如果你觉得这个服务对你有帮助，请在B站关注我，以及
        <router-link class="router" style="color: red" to="/sponsors">
          给我打钱！
        </router-link>
        <br />
        若您不想被强制使用夸克下载，可以打钱之后加群708842363联系我，我会给你的账户开通权限。多少随意，大于5元即可。
        <v-row justify="center">
          <v-col style="max-width: 400px">
            <v-btn
              :icon="undefined"
              block
              variant="outlined"
              @click="notification = false"
            >
              我知道了
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-alert>
    <v-alert
      v-if="!maintaining && isClient && notification"
      class="mb-3"
      type="info"
    >
      <template #title>
        <v-alert-title> 暂停服务通知</v-alert-title>
      </template>
      <template #text>
        投影生成器服务将在2025年1月8日起暂停服务，进行数据和服务器迁移，以及代码重构。
        本次维护预计持续2-3天，敬请谅解。
        <br />
        如果你觉得这个服务对你有帮助，请在B站关注我，以及
        <router-link class="router" style="color: red" to="/sponsors">
          给我打钱！
        </router-link>
        <br />
        若您不想被强制使用夸克下载，可以打钱之后加群708842363联系我，我会给你的账户开通权限。多少随意，大于5元即可。
        <v-row justify="center">
          <v-col style="max-width: 400px">
            <v-btn
              :icon="undefined"
              block
              variant="outlined"
              @click="notification = false"
            >
              我知道了
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-alert>
    <div class="w-100 d-flex flex-row justify-center">
      <div v-if="mdAndUp" style="width: 150px">
        <div data-some-item="aaa" />
        <sidebar-ad style="position: sticky; top: 80px; right: 10px" />
      </div>
      <div>
        <template v-if="locale === 'zh_cn'">
          <v-btn
            class="mb-4 mr-4"
            color="primary"
            href="https://docs.qq.com/form/page/DVHdSUXJLQUpDVktQ"
            prepend-icon="mdi-comment-quote"
            rounded="lg"
            variant="outlined"
          >
            新版意见反馈
          </v-btn>
          <v-btn
            class="mb-4 mr-4"
            color="primary"
            href="https://space.bilibili.com/1545239761"
            prepend-icon="custom:Bilibili"
            rounded="lg"
            variant="outlined"
          >
            请在B站关注我，有故障请私信
          </v-btn>
        </template>
        <v-btn
          class="mb-4 mr-4"
          color="primary"
          prepend-icon="mdi-upload"
          rounded="lg"
          variant="outlined"
        >
          {{ $t('litematica_generator.upload.button_msg') }}
          <v-dialog
            #default="{ isActive }"
            activator="parent"
            close-on-back
            max-width="900"
            persistent
          >
            <v-card variant="flat">
              <LitematicaUpload />
              <div class="position-absolute top-0 right-0">
                <v-btn
                  icon="mdi-close"
                  variant="plain"
                  @click="isActive.value = false"
                />
              </div>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-row justify="center">
          <v-pagination
            v-model="page"
            :length="(serverResponse?.count ?? 1000000) / 20"
            :total-visible="Math.min(8, width / 80 - 2)"
          />
        </v-row>
        <v-row v-for="row in itemDisplay" align="start" justify="center">
          <bottom-bar-ad v-if="row.ad" :height="300" />
          <v-col
            v-for="item in row.def"
            v-else
            :key="item.key"
            :cols="12 / itemsPerRow"
          >
            <MinecraftFarmCard :item="item" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-pagination
            v-model="page"
            :length="(serverResponse?.count ?? 1000000) / 20"
            :total-visible="Math.min(8, width / 80 - 2)"
          />
        </v-row>
        <div class="text-center v-card-subtitle w-100 pt-2">
          {{
            $t('litematica_generator.total_downloads', [
              serverResponse?.downloads,
            ])
          }}
        </div>
      </div>
      <div v-if="mdAndUp" style="width: 150px">
        <div data-some-item="aaa" />
        <sidebar-ad style="position: sticky; top: 80px; right: 10px" />
      </div>
    </div>
    <BottomBarAd :height="300" />
  </v-container>
</template>

<script lang="ts" setup>
import MinecraftFarmCard, {
  type Item,
} from '~/components/yisibite/MinecraftFarmCard.vue';

export type MachineDef = {
  name: string;
  downloads?: number;
  available?: boolean | null;
  hasX?: boolean;
  hasY?: boolean;
  hasZ?: boolean;
  note?: string;
  summary?: string;
  link?: string;
  linkChina?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  author?: Partial<Profile>;
};

const { t } = useI18n();
useSeoMeta({
  title: t('litematica_generator.title') + ' - Reden',
  ogTitle: t('litematica_generator.title') + ' - Reden',
  description: t('litematica_generator.og_description'),
  ogDescription: t('litematica_generator.og_description'),
  ogImage: 'https://redenmc.com/reden_256.png',
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
  `/api/mc-services/yisibite/?lang=${locale.value}`,
  {
    dedupe: 'defer',
    cache: 'force-cache',
    key: `generators${locale.value}`,
    headers: {
      Authorization: process.env.REDEN_API_TOKEN as string,
    },
  },
);
const localePath = useLocalePath();

const items: Item[] = [];
for (const [key, def] of Object.entries(serverResponse.value?.d ?? {}).sort(
  ([, a], [, b]) => (b.downloads ?? 0) - (a.downloads ?? 0),
)) {
  items.push({
    id: key,
    name: def.name,
    description: def.note || '',
    upvotes: 0,
    downloads: def.downloads || 0,
    thumbnailUrl: def.thumbnailUrl,
    author: def.author ?? {},
  });
}

const isClient = import.meta.client;
const notification = ref(true);
</script>
<template>
  <v-container class="pa-4">
    <v-alert v-if="isClient && notification" class="mb-3" type="info">
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
    <v-btn
      :to="localePath('/litematica/old')"
      class="mb-4 mr-4"
      color="primary"
      prepend-icon="mdi-arrow-left"
      rounded="lg"
      variant="outlined"
    >
      回到旧版生成器
    </v-btn>
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
    <v-row align="start" justify="center">
      <v-col v-for="item in items" :key="item.id" md="4" sm="6" xs="12">
        <MinecraftFarmCard :item="item" />
      </v-col>
    </v-row>
    <div class="text-center v-card-subtitle w-100">
      {{
        $t('litematica_generator.total_downloads', [serverResponse?.downloads])
      }}
    </div>
  </v-container>
</template>

<style scoped></style>

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
const { data: total } = useNuxtData('total');
if (!total.value) {
  await useFetch('/api/mc-services/yisibite/total', {
    dedupe: 'defer',
    cache: 'force-cache',
    key: 'total',
    headers: {
      Authorization: process.env.REDEN_API_TOKEN as string,
    },
  });
}

const { data: serverResponse } =
  useNuxtData<Record<string, MachineDef>>('generators');
if (!serverResponse.value) {
  await useFetch<Record<string, MachineDef>>('/api/mc-services/yisibite/', {
    dedupe: 'defer',
    cache: 'force-cache',
    key: 'generators',
    headers: {
      Authorization: process.env.REDEN_API_TOKEN as string,
    },
  });
}
const localePath = useLocalePath();

const items: Item[] = [];
for (const [key, def] of Object.entries(serverResponse.value ?? {}).sort(
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
</script>
<template>
  <v-container class="pa-4">
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
      {{ $t('litematica_generator.total_downloads', [total]) }}
    </div>
  </v-container>
</template>

<style scoped></style>

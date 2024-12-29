<script lang="ts" setup>
import MinecraftFarmCard, {
  type Item,
} from '~/components/yisibite/MinecraftFarmCard.vue';
import type { MachineDef } from '~/pages/litematica/index.vue';

const { data: total } = await useFetch('/api/mc-services/yisibite/total');

const { data: serverResponse } = await useFetch<{
  [key: string]: MachineDef;
}>('/api/mc-services/yisibite/');

const items: Item[] = [];
for (const [key, def] of Object.entries(serverResponse.value ?? {})) {
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
    <v-row align="start" justify="center">
      <v-col v-for="item in items" :key="item.id" md="4" sm="6" xs="12">
        <MinecraftFarmCard :item="item" />
      </v-col>
    </v-row>
  </v-container>
  <div class="text-center v-card-subtitle w-100">
    {{ $t('litematica_generator.total_downloads', [total]) }}
  </div>
</template>

<style scoped></style>

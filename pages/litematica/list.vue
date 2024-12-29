<script lang="ts" setup>
import MinecraftFarmCard from '~/components/yisibite/MinecraftFarmCard.vue';
import type { MachineDef } from '~/pages/litematica/index.vue';

type Item = {
  id: string;
  name: string;
  description: string;
  upvotes: number;
  downloads: number;
  author: Profile;
  thumbnailUrl: string;
};

const example = {
  id: 1,
  name: 'Litematica',
  description: `In 1.20.5+, instead of shulker bullets spawning in the center of the block they are in, they spawn in the center of the shulker's location. This slight shift upwards has affected farm designs. This change negates the effects of the bullets change: https://youtu.be/s5JOXGNXjQ4?si=s4NxvVL54X42P0Md
Farm is directional, do not rotate .
Drive boat into corner of fences, try in creative first if unsure.
Place 5+ snow golems if not using player in station.`,
  upvotes: 100,
  downloads: 1000,
  author: {
    username: 'Kamisama',
    avatarUrl: 'https://avatars.githubusercontent.com/u/66198935?v=4',
  },
  thumbnailUrl: '/image/example/2024-12-28_23.36.31.png',
};

const { data: total } = await useFetch('/api/mc-services/yisibite/total');

const { data: serverResponse } = await useFetch<{
  [key: string]: MachineDef;
}>('/api/mc-services/yisibite/');

const items: Item[] = [];
for (const key in serverResponse.value) {
  items.push({
    ...example,
    id: key,
    name: serverResponse.value[key].name,
    description: serverResponse.value[key].note || '',
    upvotes: 0,
    downloads: serverResponse.value[key].downloads || 0,
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
</template>

<style scoped></style>

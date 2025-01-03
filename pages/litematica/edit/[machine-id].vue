<script lang="ts" setup>
import EditTranslationCard from '~/components/yisibite/EditTranslationCard.vue';
import type { ListLitematicaResponse } from '~/pages/litematica/index.vue';

const { data: serverResponse } = await useFetch<ListLitematicaResponse>(
  '/api/mc-services/yisibite/',
  {
    key: 'generators',
  },
);

const { t, locale } = useI18n();
const route = useRoute();
const id = ref<string>(route.params['machine-id'] as string);
</script>

<template>
  <template v-if="serverResponse?.d[id]">
    <EditTranslationCard :def="serverResponse?.d[id]" />
  </template>
</template>

<style scoped></style>

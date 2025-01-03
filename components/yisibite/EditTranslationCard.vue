<script lang="ts" setup>
import type { MachineDef } from '~/pages/litematica/index.vue';

const props = defineProps<{
  def: MachineDef;
}>();

const { t, locale, availableLocales } = useI18n();
const language = ref(locale.value);
</script>

<template>
  <v-card>
    <v-card-title>
      <v-spacer />
      <v-select v-model="language" :items="availableLocales" />
    </v-card-title>
  </v-card>
</template>

<style scoped></style>

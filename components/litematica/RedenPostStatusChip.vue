<template>
  <v-chip
    :color="colorMap[value]"
    :text="t('reden.post.status.' + String(value).toLowerCase())"
  />
</template>
<script lang="ts" setup>
const props = defineProps<{
  value: string;
}>();
const { t } = useI18n();

const colorMap: Record<string, string> = {
  Pending: 'grey',
  Approved: 'green',
  Rejected: 'red',
  Deleted: 'red',
  TakenDown: 'red',
};
</script>

<!--
显示自己上传的投影。
可以进入其中的一项进行编辑。
-->
<script lang="ts" setup>
import type { ListLitematicaResponse } from '~/pages/litematica/index.vue';

const page = ref(1);
const { data } = useFetch<ListLitematicaResponse>(
  () => `/api/mc-services/yisibite/me?page=${page.value}`,
);
</script>

<template>
  <v-data-table-server
    :headers="[
      { title: 'ID', key: 'key' },
      { title: '类型', key: 'type' },
      { title: '名称', key: 'name' },
      { title: '描述', key: 'description' },
      { title: '创建时间', key: 'createdAt' },
      { title: '更新时间', key: 'updatedAt' },
    ]"
    :items="Object.values(data?.d ?? {})"
    :items-length="data?.count ?? 100"
    :page="page"
  ></v-data-table-server>
</template>

<style scoped></style>

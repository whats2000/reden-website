<script setup lang="ts">
import { useRoute } from '#vue-router';
import { ref } from 'vue';
import { doFetchGet, type Profile } from '~/utils/constants';

type Parameter = {
  search: string;
  pageSize: string;
  page: string;
  sort: string;
  order: 'asc' | 'desc';
};
type Backup = {
  localPath: string;
  createdAt: string;
  user: Profile;
  webUrl: string;
};
const query = { ...useRoute().query } as Parameter;
const page = ref(Number(query.page) || 1);
const pageSize = ref(Number(query.pageSize) || 10);
const totalItems = ref(10000000); // use a very large number to avoid reload
const serverItems = ref<Backup[]>([]);
const loading = ref(false);
const search = ref(query.search || '');

async function loadItems(options: {
  page: number;
  itemsPerPage: number;
  sortBy: {
    key: string;
    order: 'asc' | 'desc';
  }[];
  sortDesc: boolean;
}) {
  if (import.meta.client) {
    loading.value = true;
    let response = (await (
      await doFetchGet('/api/backup/list', {
        page: String(options.page),
        pageSize: String(options.itemsPerPage),
      })
    ).json()) as {
      items: Backup[];
      total: number;
    };
    serverItems.value = response.items;
    totalItems.value = response.total;
    loading.value = false;
  }
}

function deleteItem(item: Backup) {
  console.log(item);
}
</script>

<template>
  <div>
    <h1>我的备份</h1>
  </div>
  <v-data-table-server
    :headers="[
      {
        title: '存档路径',
        key: 'localPath',
      },
      {
        title: '创建时间',
        key: 'createdAt',
      },
      {
        title: '创建者',
        key: 'user',
      },
      {
        title: '操作',
        key: 'actions',
        sortable: false,
        minWidth: '150px',
      },
    ]"
    :items="serverItems"
    :items-length="totalItems"
    :page="page"
    :items-per-page="pageSize"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <template #[`item.actions`]="{ item }">
      <v-btn :href="item.webUrl" color="primary">查看</v-btn>
      <v-btn @click="deleteItem(item)" color="error">删除</v-btn>
    </template>
  </v-data-table-server>
</template>

<style scoped></style>

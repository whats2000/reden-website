<script lang="ts" setup>
import { useRoute } from '#vue-router';
import { ref } from 'vue';
import { doFetchDelete, doFetchGet, type Profile } from '~/utils/constants';
import { toast } from 'vuetify-sonner';

definePageMeta({
  title: 'profile.my_backup',
});
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
  itemId: string;
  cloudDriveId: number;
};
const query = { ...useRoute().query } as Parameter;
const page = ref(Number(query.page) || 1);
const pageSize = ref(Number(query.pageSize) || 10);
const totalItems = ref(10000000); // use a very large number to avoid reload
const serverItems = ref<Backup[]>([]);
const loading = ref(false);
const search = ref(query.search || '');
const downloading = ref(false);

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
  if (item.cloudDriveId == 1) {
    doFetchDelete(`/api/backup/v1/onedrive/${item.itemId}`).then((response) => {
      if (response.ok) {
        loadItems({
          page: page.value,
          itemsPerPage: pageSize.value,
          sortBy: [],
          sortDesc: false,
        });
        toast('删除成功', {
          cardProps: {
            color: 'green',
          },
        });
      } else {
        toastError(response);
      }
    });
  } else {
    toastError('暂不支持删除此云盘的备份');
  }
}
</script>

<template>
  <div>
    <h1>我的云备份</h1>
    <p>
      云备份功能尚处于内测阶段，如有问题请联系管理员。 关注<a
        class="router"
        href="https://space.bilibili.com/1545239761/dynamic"
        >我的B站</a
      >获取最新消息。 在内测阶段，我们将提供免费的云备份服务，但<span
        style="color: red"
        >不保证数据的安全性</span
      >，请自行备份重要数据。
    </p>
    <p>请注意，云备份功能仅用于存档文件的备份，不包括服务器的配置文件等。</p>
    <p style="color: red">
      请勿上传任何违法违规内容，严禁逆向工程、破解、压力测试等行为，一经发现将会被封禁账号。
      构成犯罪的将会移交公安机关处理。
    </p>
    <p>
      云备份存档为zip压缩文件，您可以在下载后
      <span style="color: green">手动解压</span>
      到服务器的存档文件夹中，也可以
      <span style="color: green"
        >通过指令导入进 X Backup 模组的增量备份数据库中。（还没写）
      </span>
    </p>
  </div>
  <v-data-table-server
    :headers="[
      {
        title: '存档路径',
        key: 'localPath',
      },
      {
        title: '世界名称',
        key: 'worldName',
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
    :items-per-page="pageSize"
    :loading="loading"
    :page="page"
    :search="search"
    @update:options="loadItems"
  >
    <template #[`item.actions`]="{ item }">
      <v-btn :href="item.webUrl" :loading="downloading" color="primary"
        >查看/下载
      </v-btn>
      <v-btn color="error" @click="deleteItem(item)">删除</v-btn>
    </template>
    <template #[`item.user`]="{ item }">
      {{ item.user.username }}
    </template>
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
  </v-data-table-server>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { MachineDef } from '~/pages/litematica/index.vue';
import type { SubmitEventPromise } from 'vuetify';
import { toast } from 'vuetify-sonner';

const { data: serverResponse } = await useFetch<{
  [key: string]: MachineDef & {
    conditions?: {
      x: string[];
      y: string[];
      z: string[];
    };
  };
}>('/api/mc-services/yisibite/', {
  key: 'generators',
  headers: {
    Authorization: process.env.REDEN_API_TOKEN as string,
  },
});

const id = ref<string>('');
const language = ref<string>('en');
const name = ref<string>();
const summary = ref<string>();
const description = ref<string>();
const file = ref<File>();
const image = ref<File>();
const link = ref<string>();

async function submit(e: SubmitEventPromise) {
  if (!(await e).valid) {
    toast.error('Please fill in all required fields');
    return;
  }
  if (file.value) {
    await doFetchPut(`/api/mc-services/yisibite/${id.value}`, file.value);
  }
}
</script>

<template>
  <div class="d-flex justify-center w-100">
    <v-card max-width="700" width="700">
      <v-card-text>
        <v-skeleton-loader v-if="!serverResponse" />
        <v-form v-if="serverResponse">
          <v-combobox
            v-model="id"
            :items="Object.keys(serverResponse ?? {})"
            label="Machine"
            required
            @update:model-value="
              () => {
                if (serverResponse && serverResponse[id]) {
                  name = serverResponse[id].name;
                  summary = serverResponse[id].summary;
                  description = serverResponse[id].note;
                  link = serverResponse[id].link;
                }
              }
            "
          />
          <v-file-input
            v-model="file"
            label="File"
            @update:model-value="
              (files) => {
                if (files instanceof Array) {
                  file = files[0];
                } else {
                  file = files;
                }
                if (!name) {
                  name = file.name.replace('.litematic', '');
                  toast.success('Auto-filled name from file name');
                }
                if (!id) {
                  id = name
                    .toLowerCase()
                    .replace('.litematic', '')
                    .replace(/[^a-z0-9]/g, '');
                  toast.success('Auto-filled id from name');
                }
              }
            "
          />
          <v-select
            v-model="language"
            :items="['en', 'zh_cn', 'zh_tw']"
            :item-title="(item) => $t(item)"
            label="Language"
            required
          />
          <v-text-field v-model="name" label="Name" />
          <v-text-field v-model="summary" label="Summary" />
          <v-textarea v-model="description" label="Description" />
          <v-text-field v-model="link" label="Link" />
          <v-file-input v-model="image" label="Image" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit" variant="elevated"> Submit</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { ListLitematicaResponse } from '~/pages/litematica/index.vue';
import type { SubmitEventPromise } from 'vuetify';
import { toast } from 'vuetify-sonner';
import { getGlobalThis } from '@vue/shared';

const { data: serverResponse } = await useFetch<ListLitematicaResponse>(
  '/api/mc-services/yisibite/',
  {
    key: 'generators',
  },
);

const { t, locale } = useI18n();
const id = ref<string>('');
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const name = ref<string>();
const summary = ref<string>();
const description = ref<string>();
const file = ref<File>();
const image = ref<File>();
const imageUri = ref<string>();
const link = ref<string>();
const uploading = ref(false);

async function submit(e: SubmitEventPromise) {
  if (!(await e).valid) {
    toast.error('Please fill in all required fields');
    return;
  }
  uploading.value = true;
  if (file.value) {
    const response = await doFetchPut(
      `/api/mc-services/yisibite/${id.value}`,
      file.value,
    );
    if (response.ok) {
      toast.success('File uploaded successfully');
      file.value = undefined;
    } else {
      await toastError(response, 'Failed to upload file');
      uploading.value = false;
      return;
    }
  }
  const response = await doFetchPost(
    `/api/mc-services/yisibite/${id.value}/info/${locale.value}`,
    {
      name: name.value,
      summary: summary.value,
      description: description.value,
      link: link.value,
    },
  );
  if (response.ok) {
    toast.success('Info uploaded successfully');
  } else {
    await toastError(response, 'Failed to upload info');
    uploading.value = false;
    return;
  }
  uploading.value = false;
}
</script>

<template>
  <div class="d-flex justify-center w-100">
    <v-form v-if="serverResponse" @submit.prevent="submit">
      <v-card max-width="700" width="700">
        <v-card-text>
          <v-skeleton-loader v-if="!serverResponse" />
          <v-combobox
            v-model="id"
            :items="Object.keys(serverResponse.d)"
            label="Machine"
            required
            @update:model-value="
              () => {
                if (serverResponse && serverResponse.d[id]) {
                  name = serverResponse.d[id].name;
                  summary = serverResponse.d[id].summary;
                  description = serverResponse.d[id].note;
                  link = serverResponse.d[id].link;
                  imageUri = serverResponse.d[id].thumbnailUrl;
                }
              }
            "
          />
          <v-file-input
            v-model="file"
            density="comfortable"
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
          >
            <template #details>
              Upload new file here will replace the existing file
            </template>
          </v-file-input>
          <v-select
            v-model="locale"
            :item-title="(item) => t(item)"
            :item-value="(item) => item"
            :items="['en', 'zh_cn', 'zh_tw']"
            density="comfortable"
            label="Language"
            required
            @update:model-value="
              (lang) => router.replace(switchLocalePath(lang))
            "
          />
          <v-row>
            <v-col>
              You are editing machine
              {{ name ?? id }}
              information in
              {{ t(locale) }}
            </v-col>
          </v-row>
          <v-text-field v-model="name" density="comfortable" label="Name" />
          <v-text-field
            v-model="summary"
            density="comfortable"
            label="Summary"
          />
          <v-textarea
            v-model="description"
            density="comfortable"
            label="Description"
          />
          <v-text-field v-model="link" density="comfortable" label="Link">
            <template #details>
              <template v-if="parseBVID(link)">
                已解析的 Bilibili BV 号：
                {{ parseBVID(link) }}
              </template>
            </template>
          </v-text-field>
          <v-file-input
            v-model="image"
            density="comfortable"
            label="Image"
            @update:model-value="
              () => {
                if (image) {
                  imageUri = getGlobalThis().URL.createObjectURL(image);
                } else {
                  getGlobalThis().URL.revokeObjectURL(imageUri);
                  imageUri = undefined;
                }
              }
            "
          >
            <template #append-inner>
              <div class="d-flex flex-row justify-center">
                <img
                  style="max-height: 240px"
                  v-if="imageUri"
                  :src="imageUri"
                  alt="thumbnail"
                />
              </div>
            </template>
          </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="uploading"
            color="primary"
            type="submit"
            variant="elevated"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<style scoped></style>

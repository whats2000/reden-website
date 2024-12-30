<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAppStore } from '~/store/app';
import { type SubmitEventPromise, useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import SizeInput from '~/components/yisibite/SizeInput.vue';
import 'assets/main.css';
import { doFetchGet, doFetchPut, toastError } from '~/utils/constants';
import { toast } from 'vuetify-sonner';
import type { Machine, MachineDef } from '~/pages/litematica/index.vue';

const route = useRoute();
const router = useRouter();
const xSize = ref(0);
const ySize = ref(0);
const zSize = ref(0);
const loading = ref(false);
const name = ref('');
const { t } = useI18n();
const localePath = useLocalePath();
useSeoMeta({
  title: t('litematica_generator.title') + ' - Reden',
  ogTitle: t('litematica_generator.title') + ' - Reden',
  description: t('litematica_generator.og_description'),
  ogDescription: t('litematica_generator.og_description'),
  ogImage: 'https://redenmc.com/reden_256.png',
});

const selecting = ref(true);

const { mobile } = useDisplay({
  mobileBreakpoint: 600,
});
const { data: total } = await useFetch('/api/mc-services/yisibite/total', {
  key: 'total',
  headers: {
    Authorization: process.env.REDEN_API_TOKEN as string,
  },
});

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
const generators = computed<Record<string, Machine>>(() => {
  if (serverResponse.value) {
    let machines: { [key: string]: Machine } = {};
    for (let key in serverResponse.value) {
      const min = (size: number) => {
        const f = (v: number) =>
          v >= size || t('litematica_generator.size_min', { size });
        f.min = size;
        return f;
      };
      const max = (size: number) => {
        const f = (v: number) =>
          v <= size || t('litematica_generator.size_max', { size });
        f.max = size;
        return f;
      };
      const mod = (mod: number, rem: number) => {
        const f = (v: number) =>
          v % mod === rem || t('litematica_generator.size_mod', { mod, rem });
        f.mod = mod;
        f.rem = rem;
        return f;
      };
      const defaultChecker = [min(0), max(1000), mod(1, 0)];
      machines[key] = {
        ...serverResponse.value[key],
        conditions: {
          x:
            serverResponse.value[key].conditions?.x?.map((s) => eval(s)) ??
            defaultChecker,
          y:
            serverResponse.value[key].conditions?.y?.map((s) => eval(s)) ??
            defaultChecker,
          z:
            serverResponse.value[key].conditions?.z?.map((s) => eval(s)) ??
            defaultChecker,
        },
      };
    }
    name.value = route.query.m?.toString() || '';
    if (import.meta.client) {
      if (!machines[name.value]) name.value = Object.keys(machines)[0];
    }
    return Object.keys(machines)
      .sort()
      .reduce((obj: Record<string, Machine>, key) => {
        obj[key] = machines[key];
        return obj;
      }, {});
  }
  return {};
});

async function submit(e: SubmitEventPromise) {
  if ((await e).valid) {
    // open a new window to download
    window.open(
      `/api/mc-services/yisibite/${name.value}?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
    );
    setTimeout(() => {
      refreshNuxtData();
    }, 1000);
  }
}

function openMaterials() {
  window.open(
    `/api/mc-services/yisibite/${name.value}/materials?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
  );
}

const selected = computed(() => generators.value[name.value]);

const uploadFile = ref<File>();
const uploadPath = ref('');
const uploadName = ref('');

const cache = ref<{
  name: string;
  approved: boolean;
  approvedBy: Profile;
}>();
const uploadCache = (name: string) => {
  console.log('uploadCache', name);
  const existing = generators.value[name];
  if (existing) {
    uploadName.value = existing.name;
  }
  if (name) {
    doFetchGet(`/api/mc-services/yisibite/${name}/approval`)
      .then(async (res) => {
        if (res.status == 404) {
          cache.value = {
            name: '404 Not Found',
            approved: false,
          };
        } else {
          if (!res.ok) return Promise.reject(res);
          cache.value = await res.json();
        }
      })
      .catch((e) => toastError(e));
  }
};

async function submitUpload(e: SubmitEventPromise) {
  console.log(uploadFile.value);
  const a = await e;
  if (a.valid) {
    loading.value = true;
    doFetchPut(
      `/api/mc-services/yisibite/${uploadPath.value}?name=${uploadName.value}`,
      uploadFile.value!,
    )
      .then((res) => {
        if (!res.ok) return Promise.reject(res);
        toast.success('Uploaded');
      })
      .catch((e) => toastError(e))
      .finally(() => (loading.value = false));
  } else {
    await toastError(a.errors[0].errorMessages.join(' '));
  }
}
</script>

<template>
  <v-form class="content-common" fast-fail @submit.prevent="submit">
    <v-row>
      <v-col>
        <h1>
          {{ $t('litematica_generator.title') }}
        </h1>
        <p>
          {{ $t('litematica_generator.description') }}
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" style="min-width: 200px">
        {{ $t('litematica_generator.select') }}
      </v-col>
      <v-select
        v-model="name"
        :item-title="(item) => generators[item]?.name"
        :item-value="(item) => item"
        :items="Object.keys(generators)"
        active
        density="comfortable"
        hide-details
        @update:model-value="router.replace({ query: { m: name } })"
      >
        <template #item="{ item, props }">
          <v-list-item :subtitle="item.value" v-bind="props">
            <template #append>
              <v-chip v-if="!mobile && generators[item.value]">
                {{
                  $t('litematica_generator.download_count', {
                    count: generators[item.value]?.downloads,
                  })
                }}
              </v-chip>
            </template>
            <template #title class="text-break">
              {{ item.title }}
            </template>
          </v-list-item>
        </template>
        <template #append-inner>
          <v-chip>
            {{
              $t('litematica_generator.download_count', {
                count: selected?.downloads ?? '查询失败',
              })
            }}
          </v-chip>
        </template>
      </v-select>
      <v-col v-if="false" cols="12">
        <v-card border>
          <v-card-actions>
            {{ selected.name }}
            <v-spacer />
            <v-btn
              :icon="selecting ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="selecting = !selecting"
            ></v-btn>
          </v-card-actions>
        </v-card>
        <v-expand-transition v-show="selecting">
          <v-radio-group
            v-model="name"
            @update:model-value="router.replace({ query: { m: name } })"
          >
            <v-radio
              v-for="key in Object.keys(generators)"
              :key="key"
              :value="key"
            >
              <template #label>
                {{ generators[key]?.name }}
                <v-chip>
                  {{
                    $t('litematica_generator.download_count', {
                      count: generators[key]?.downloads ?? '查询失败',
                    })
                  }}
                </v-chip>
              </template>
            </v-radio>
          </v-radio-group>
        </v-expand-transition>
      </v-col>
      <v-col v-if="selected?.link" class="overflow-hidden" cols="12">
        <a :href="selected.link" class="router nowrap">
          <v-icon>mdi-link</v-icon>
          {{ selected.link }}
        </a>
      </v-col>
      <v-col
        v-if="selected?.note"
        class="overflow-hidden"
        cols="12"
        v-html="selected.note"
      />
    </v-row>

    <v-row>
      <v-col>
        <v-card
          v-if="selected?.hasX || selected?.hasY || selected?.hasZ"
          border
        >
          <v-card-subtitle class="text-wrap pa-3">
            {{ $t('litematica_generator.size_description') }}
          </v-card-subtitle>
          <v-card-text>
            <SizeInput
              v-if="selected.hasX"
              :key="selected.name + 'x'"
              v-model="xSize"
              :def="selected"
              xyz="x"
            />
            <SizeInput
              v-if="selected.hasY"
              :key="selected.name + 'y'"
              v-model="ySize"
              :def="selected"
              xyz="y"
            />
            <SizeInput
              v-if="selected.hasZ"
              :key="selected.name + 'z'"
              v-model="zSize"
              :def="selected"
              xyz="z"
            />
            <v-row>
              <v-spacer />
              <v-btn
                :disabled="selected?.available === false"
                :loading="loading"
                class="ma-3"
                color="primary"
                type="button"
                variant="outlined"
                @click="openMaterials"
              >
                材料列表
              </v-btn>
              <v-btn
                :disabled="selected?.available === false"
                :loading="loading"
                class="ma-3"
                color="primary"
                type="submit"
              >
                {{ $t('litematica_generator.download') }}
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-btn class="ma-4">
        Upload
        <v-dialog activator="parent" max-width="600">
          <v-card>
            <v-card-title>Upload Machine</v-card-title>
            <v-form @submit.prevent="submitUpload">
              <v-col>
                <v-combobox
                  v-model="uploadPath"
                  :items="Object.keys(generators)"
                  clearable
                  label="path"
                  @update:model-value="uploadCache(uploadPath)"
                >
                  <template #details>
                    {{
                      cache?.approved
                        ? 'Approved'
                        : cache?.approved === false
                          ? cache?.name
                          : 'Querying'
                    }}
                  </template>
                </v-combobox>
                <v-text-field v-model="uploadName" label="name" />
                <a
                  href="https://v8g1c-my.sharepoint.com/:w:/g/personal/zly2006_redenmc_com1/Eb_9sZGN-EhBsMU8sCkfN7sBNO7FdK81OUumXFAhb5byxQ"
                  >View requirements and the format here</a
                >
                <v-file-input
                  v-model="uploadFile"
                  :rules="[
                    () =>
                      (uploadFile?.name?.endsWith('.litematic') ?? false) ||
                      'Must be litematica files.',
                  ]"
                  clearable
                  label="file"
                  @update:modelValue="
                    (files) => {
                      const file = (
                        files instanceof Array ? files[0] : files
                      ) as File;
                      if (!uploadFile) {
                        toast('Please select a file', {
                          cardProps: {
                            color: 'error',
                          },
                        });
                        return;
                      }
                      if (name == '') {
                        name = uploadFile.name.replace('.litematic', '');
                      }
                      if (uploadPath == '') {
                        uploadPath = uploadFile.name
                          .replace('.litematic', '')
                          .replaceAll(/[^\w\-.+]/g, '')
                          .toLowerCase();
                      }
                    }
                  "
                />
              </v-col>
              <v-col>
                <v-row>
                  <v-spacer />
                  <v-btn :loading="loading" color="primary" type="submit"
                    >Upload
                  </v-btn>
                </v-row>
              </v-col>
            </v-form>
          </v-card>
        </v-dialog>
      </v-btn>
    </v-row>
    <v-row v-if="!useAppStore().logined" class="text-sm-body-1">
      <v-col>
        <reden-router :to="localePath('/login')">
          {{ $t('litematica_generator.not_logged_in') }}
        </reden-router>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>FAQ</h3>
        <h4>17x17的空置域应该输入多少？</h4>
        <p>17x16=272，272的大小包含了两边各一格的铁砧墙宽度。</p>
        <h4>没有找到你想要的机器？</h4>
        <p>
          {{ $t('litematica_generator.contribute') }}
          <a class="router" href="mailto:me@redenmc.com">me@redenmc.com</a>
        </p>
        <br />
        <div class="text-center v-card-subtitle w-100">
          {{ $t('litematica_generator.total_downloads', [total]) }}
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
p {
  font-size: 1em;
}

.nowrap {
  white-space: nowrap;
}
</style>

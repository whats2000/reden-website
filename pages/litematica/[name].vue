<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAppStore } from '~/store/app';
import { type SubmitEventPromise, useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import SizeInput from '~/components/yisibite/SizeInput.vue';
import 'assets/main.css';
import type { Machine, MachineDef } from '~/pages/litematica/index.vue';

const route = useRoute();
const router = useRouter();
const xSize = ref(0);
const ySize = ref(0);
const zSize = ref(0);
const loading = ref(false);
const name = route.params.name as string;
const { t } = useI18n();
const localePath = useLocalePath();
useSeoMeta({
  title: name + ' - Reden' + t('litematica_generator.title'),
  ogTitle: name + ' - Reden' + t('litematica_generator.title'),
  description: t('litematica_generator.og_description'),
  ogDescription: t('litematica_generator.og_description'),
  ogImage: 'https://redenmc.com/reden_256.png',
});

const { data: total } = await useFetch('/api/mc-services/yisibite/total');
const { data: serverResponse } = await useFetch<{
  [key: string]: MachineDef & {
    conditions?: {
      x: string[];
      y: string[];
      z: string[];
    };
  };
}>('/api/mc-services/yisibite/');
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
      const defaultChecker = [min(0), max(2006), mod(1, 0)];
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
    if (!machines[name]) {
      throw createError({
        status: 404,
        message: t('litematica_generator.not_found', { name }),
      });
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
      `/api/mc-services/yisibite/${name}?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
    );
    setTimeout(() => {
      refreshNuxtData();
    }, 1000);
  }
}

function openMaterials() {
  window.open(
    `/api/mc-services/yisibite/${name}/materials?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
  );
}

const selected = computed(() => generators.value[name]);
</script>

<template>
  <v-form class="content-common" fast-fail @submit.prevent="submit">
    <v-row>
      <h1>
        {{ selected.name }}
        <v-chip v-if="selected">
          {{
            $t('litematica_generator.download_count', {
              count: selected?.downloads,
            })
          }}
        </v-chip>
      </h1>
      <v-col v-if="selected?.link" class="overflow-hidden" cols="12">
        <a :href="selected.link" class="router nowrap">
          <v-icon>mdi-link</v-icon>
          {{ selected.link }}
        </a>
      </v-col>
      <v-col
        v-if="false && selected?.note"
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

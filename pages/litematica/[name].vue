<script lang="ts" setup>
import { ref } from 'vue';
import { useAppStore } from '~/store/app';
import { type SubmitEventPromise, useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import SizeInput from '~/components/yisibite/SizeInput.vue';
import 'assets/main.css';
import type {
  ListLitematicaResponse,
  Machine,
  MachineDef,
} from '~/pages/litematica/index.vue';
import { parseBVID } from '~/utils/constants';
import BottomBarAd from '~/components/ads/BottomBarAd.vue';
import SidebarAd from '~/components/ads/SidebarAd.vue';

const route = useRoute();
const xSize = ref(0);
const ySize = ref(0);
const zSize = ref(0);
const loading = ref(false);
const machineId = route.params.name as string;
const { t, locale } = useI18n();
const localePath = useLocalePath();
const appStore = useAppStore();
const openEditDialog = ref(false);
const { data: localizedData } = useNuxtData<Record<string, MachineDef>>(
  `edit-${machineId}`,
);

const { data: serverResponse } = useNuxtData<ListLitematicaResponse>(
  `generators${locale.value}`,
);

if (!serverResponse.value) {
  const { data, status, error } = await useFetch<ListLitematicaResponse>(
    `/api/mc-services/yisibite/?lang=${locale.value}`,
    {
      key: `generators${locale.value}`,
    },
  );
  serverResponse.value = data.value;
  if (status.value === 'error') {
    console.error(serverResponse.value, status.value, error.value);
    throw createError({
      status: error.value?.statusCode ?? 500,
      message: JSON.stringify(error.value),
    });
  }
}
const { mobile } = useDisplay();
const generators = computed<Record<string, Machine>>(() => {
  if (serverResponse.value) {
    let machines: { [key: string]: Machine } = {};
    for (let key in serverResponse.value.d) {
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
      // Default checkers ensure these function won't be deleted in output.
      const defaultChecker = [min(0), max(2006), mod(1, 0)];
      const dto: ListLitematicaResponse['d'][''] = serverResponse.value.d[key];
      machines[key] = {
        ...dto,
        conditions: {
          x: dto.conditions?.x?.map((s) => eval(s)) ?? defaultChecker,
          y: dto.conditions?.y?.map((s) => eval(s)) ?? defaultChecker,
          z: dto.conditions?.z?.map((s) => eval(s)) ?? defaultChecker,
        },
      };
    }
    if (!machines[machineId]) {
      throw createError({
        status: 404,
        message: t('litematica_generator.not_found', { name: machineId }),
      });
    }
    useHead({
      title:
        machines[machineId]?.name +
        ' - Reden' +
        t('litematica_generator.title'),
    });
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
      `/api/mc-services/yisibite/${machineId}?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
    );
    setTimeout(() => {
      refreshNuxtData();
    }, 1000);
  }
}

function openMaterials() {
  window.open(
    `/api/mc-services/yisibite/${machineId}/materials?xSize=${xSize.value}&ySize=${ySize.value}&zSize=${zSize.value}`,
  );
}

const selected = computed(() => generators.value[machineId]);

useSeoMeta({
  title: t('litematica_generator.web_title', {
    name: selected.value.name,
  }),
  ogTitle: t('litematica_generator.web_title', {
    name: selected.value.name,
  }),
  description:
    selected.value.description ?? t('litematica_generator.og_description'),
  ogDescription:
    selected.value.description ?? t('litematica_generator.og_description'),
  ogImage: 'https://redenmc.com/reden_256.png',
});
const biliPlayer = useTemplateRef<HTMLIFrameElement>('biliPlayer');
const bvid = computed(() => parseBVID(selected.value?.link));
const tabs = computed(() => {
  const tabs: {
    key: string;
    title: string;
  }[] = [];
  if (selected.value.imageUrl) {
    tabs.push({
      key: 'picture',
      title: '图片',
    });
  }
  if (bvid.value) {
    tabs.push({
      key: 'bilibili',
      title: 'Bilibili',
    });
  }
  return tabs;
});
const tab = ref(
  import.meta.server ? 'picture' : tabs.value[tabs.value.length - 1]?.key,
);
</script>

<template>
  <v-form class="content-common" fast-fail @submit.prevent="submit">
    <v-btn
      :to="localePath('/litematica')"
      class="mb-3"
      prepend-icon="mdi-arrow-left"
      variant="tonal"
    >
      查看所有可生成的机器
    </v-btn>
    <v-row justify="center">
      <h1>
        {{ selected?.name }}
      </h1>
    </v-row>
    <v-row justify="center" style="line-height: 32px">
      by&nbsp;
      <!--suppress HtmlUnknownTarget -->
      <router-link
        v-if="selected.author"
        :to="`/@${selected.author.username}`"
        class="d-flex flex-row router"
      >
        <v-avatar v-if="selected.author.avatarUrl" size="32">
          <v-img :src="selected.author.avatarUrl" />
        </v-avatar>
        {{ selected.author.username }}
      </router-link>
      <v-spacer style="max-width: 30px" />
      <v-chip v-if="selected">
        {{
          $t('litematica_generator.download_count', {
            count: selected?.downloads,
          })
        }}
      </v-chip>
    </v-row>
    <v-row v-if="appStore.logined">
      <v-col cols="12">
        <v-btn
          color="primary"
          rounded="lg"
          variant="outlined"
          @click="
            () => {
              if (!localizedData) {
                useFetch(`/api/mc-services/yisibite/${machineId}/info`, {
                  key: `edit-${machineId}`,
                });
              }
            }
          "
        >
          编辑此机器
          <v-dialog
            v-model="openEditDialog"
            activator="parent"
            close-on-back
            max-width="900"
            persistent
          >
            <v-card variant="flat">
              <LitematicaUpload v-model:machine="localizedData" edit-mode />
              <div class="position-absolute top-0 right-0">
                <v-btn
                  icon="mdi-close"
                  variant="plain"
                  @click="openEditDialog = false"
                />
              </div>
            </v-card>
          </v-dialog>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="tabs.length !== 0">
        <v-card>
          <v-tabs v-model="tab" color="primary">
            <v-tab v-if="selected.imageUrl" value="picture">图片</v-tab>
            <v-tab v-if="bvid" value="bilibili">
              <v-icon size="lg">custom:Bilibili</v-icon>
              Bilibili
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item v-if="selected?.imageUrl" value="picture">
                <v-img :src="selected.imageUrl" width="100%" />
              </v-tabs-window-item>

              <v-tabs-window-item v-if="bvid" value="bilibili">
                <iframe
                  ref="biliPlayer"
                  :src="`https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}`"
                  :style="{
                    height: `${((biliPlayer?.clientWidth ?? 0) / 16) * 9}px`,
                  }"
                  allowfullscreen
                  class="bili-player"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="selected?.link" class="overflow-hidden" cols="12">
        <a v-if="!bvid" :href="selected.link" class="router nowrap">
          <v-icon>mdi-link</v-icon>
          {{ selected.link }}
        </a>
      </v-col>
      <v-col
        v-if="selected?.description"
        class="overflow-hidden"
        cols="12"
        v-html="selected.description"
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
              v-model="xSize"
              :def="selected"
              xyz="x"
            />
            <SizeInput
              v-if="selected.hasY"
              v-model="ySize"
              :def="selected"
              xyz="y"
            />
            <SizeInput
              v-if="selected.hasZ"
              v-model="zSize"
              :def="selected"
              xyz="z"
            />
            <v-row>
              <v-spacer />
              <v-btn
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
          {{
            $t('litematica_generator.total_downloads', [
              serverResponse?.downloads,
            ])
          }}
        </div>
      </v-col>
    </v-row>
    <bottom-bar-ad />
    <bottom-bar-ad v-if="mobile" />
  </v-form>

  <div v-if="!mobile" style="position: absolute; right: 10px; top: 90px">
    <sidebar-ad />
  </div>
</template>

<style scoped>
p {
  font-size: 1em;
}

.nowrap {
  white-space: nowrap;
}

.bili-player {
  width: 100%;
  border-width: 0;
}
</style>

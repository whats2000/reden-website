<script lang="ts" setup>
import { useElementHover } from '@vueuse/core';
import { number2text, timeSince } from '@/utils/constants';
import { useDisplay } from 'vuetify';
import type { MachineDef, Tag } from '~/pages/litematica/index.vue';

const currentRoute = useRoute();

const props = defineProps<{
  item: Partial<MachineDef>;
}>();
const { mobile: _mobile } = useDisplay({
  mobileBreakpoint: 500,
});
const mobile = computed(() => (import.meta.server ? false : _mobile.value));

const card = useTemplateRef<Element>('card');
const isHovering = useElementHover(card);
const localePath = useLocalePath();
const tags = computed(
  () =>
    [props.item.categoryTag, ...(props.item.featureTags || [])].filter(
      (tag) => tag,
    ) as Tag[],
);
</script>
<template>
  <v-card
    ref="card"
    :class="{
      'hover-card': isHovering,
    }"
    :to="
      localePath(`/litematica/${item.key}`) +
      `?backUrl=${encodeURIComponent(currentRoute.fullPath)}`
    "
    border
    class="mx-auto"
    elevation="4"
    max-width="460"
    min-width="260"
    rounded="xl"
  >
    <v-img
      v-if="!mobile"
      :src="item.thumbnailUrl"
      class="thumbnail-img"
      cover
      height="200px"
    />
    <v-card-title class="card-title">{{ item.name }}</v-card-title>
    <v-card-subtitle class="opacity-100">
      <div class="d-flex flex-row author-line" style="line-height: 24px">
        by
        <v-avatar v-if="item.author?.avatarUrl" size="24">
          <v-img :src="item.author?.avatarUrl" />
        </v-avatar>
        {{ item.author?.username }}
        <v-spacer />
        <template v-if="mobile">
          <v-chip
            v-for="tag in tags"
            :key="tag.tag"
            :size="18"
            :text="tag.name"
            :to="localePath(`/litematica?tag=${tag?.tag}`)"
            class="tag-chip rounded-lg px-1"
            color="primary"
          />
          <span class="stat-line">
            <v-icon :size="22" style="top: 2px">mdi-download-outline</v-icon>
            {{ item.downloads }}
          </span>
        </template>
      </div>
    </v-card-subtitle>
    <div v-if="!mobile" class="mx-3">
      <v-chip-group>
        <v-chip
          v-for="tag in tags"
          :key="tag.tag"
          :text="tag.name"
          :to="localePath(`/litematica?tag=${tag?.tag}`)"
          class="tag-chip"
          color="primary"
        />
      </v-chip-group>
    </div>

    <v-card-text
      :class="{
        'content-position': true,
        'backdrop-blur': isHovering && item.description,
      }"
    >
      <div
        v-if="item.description"
        v-show="isHovering"
        class="description-overlay"
        v-html="item.description"
      />
    </v-card-text>

    <v-card-actions class="stat-line py-2">
      <template v-if="!mobile">
        {{ timeSince(item.updatedAt ?? Date.now()) }}
        <v-spacer />
        <v-icon size="18">mdi-download-outline</v-icon>
        {{ number2text(item.downloads ?? 0) }}
      </template>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
.backdrop-blur {
  z-index: 100;
  backdrop-filter: blur(10px);
}

.description-overlay {
  user-select: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.v-card:hover .description-overlay {
  opacity: 1;
}

.stat-line {
  opacity: 60%;
  padding: 0 14px;
  min-height: 10px !important;
  font-size: 0.75rem;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.card-title {
  font-size: 1rem;
  text-wrap: pretty;
}

@media (min-width: 800px) {
  .card-title {
    font-size: 1.25rem;
  }
}

.author-line {
  font-size: 0.75rem;
}

.content-position {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}

.v-card {
  background-image: linear-gradient(
    160deg,
    rgb(var(--v-theme-background)) 0%,
    rgba(0, 130, 193, 0.07) 30%,
    rgba(0, 130, 193, 0.17) 90%
  );
}
</style>

<script lang="ts" setup>
import { useElementHover } from '@vueuse/core';
import { type Profile } from '@/utils/constants';
import { useDisplay } from 'vuetify';

export type Item = {
  id: string;
  name: string;
  description: string;
  upvotes: number;
  downloads: number;
  author: Partial<Profile>;
  imageUrl?: string;
  thumbnailUrl?: string;
};
defineProps<{
  item: Partial<Item>;
}>();
const { mobile } = useDisplay({
  mobileBreakpoint: 500,
});

const card = useTemplateRef<Element>('card');
const isHovering = useElementHover(card);
const localePath = useLocalePath();
</script>
<template>
  <v-card
    ref="card"
    :class="{
      'hover-card': isHovering,
    }"
    :to="localePath(`/litematica/${item.id}`)"
    border
    class="mx-auto"
    elevation="4"
    max-width="360"
    min-width="280"
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
      <div class="d-flex flex-row">
        by
        <v-avatar size="24">
          <v-img :src="item.author?.avatarUrl" />
        </v-avatar>
        {{ item.author?.username }}
        <v-spacer />
        <span class="stat-line" v-if="mobile">
          <v-icon size="18">mdi-download-outline</v-icon>
          {{ item.downloads }}
        </span>
      </div>
    </v-card-subtitle>

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

    <v-card-actions class="stat-line">
      <template v-if="!mobile">
        <v-spacer />
        <v-icon size="18">mdi-download-outline</v-icon>
        {{ item.downloads }}
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
  padding: 0 10px !important;
  min-height: 10px !important;
  font-size: 0.75rem;
  line-height: 24px;
}

.card-title {
  font-size: 1.25rem;
  text-wrap: pretty;
}

.content-position {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}
</style>

<script lang="ts" setup>
import { assets } from '~/utils/litematica/assets';

const props = defineProps<{
  id: string;
  scale?: number;
}>();
const models: Record<string, { textures: Record<string, string> }> =
  assets['models'];

const textures =
  models[`item/${props.id}`]?.textures ?? models[`block/${props.id}`]?.textures;
if (!textures) {
  throw createError({
    statusCode: 400,
    message: `Model textures not found: ${props.id}`,
  });
}

const texture = (textures['side'] ?? Object.values(textures)[0])?.replace(
  'minecraft:',
  '',
);
if (!texture) {
  throw createError({
    statusCode: 400,
    message: `Texture not found: ${props.id}`,
  });
}

const textureData: [number, number, number, number] =
  assets['textures'][texture];
if (!textureData) {
  throw createError({
    statusCode: 400,
    message: `Texture data not found: ${texture}`,
  });
}

const [x, y, width, height] = textureData;
</script>

<template>
  <div
    :data-texture-id="texture"
    :style="{
      width: `${width * (scale ?? 1)}px`,
      height: `${height * (scale ?? 1)}px`,
    }"
  >
    <img
      :alt="id"
      :height="height"
      :src="`/litematica/atlas.png`"
      :style="{
        userSelect: 'none',
        objectPosition: `-${x}px -${y}px`,
        objectFit: 'none',
        imageRendering: 'pixelated',
        transformOrigin: 'top left',
        transform: `scale(${scale ?? 1})`,
      }"
      :width="width"
    />
  </div>
</template>

<style scoped></style>

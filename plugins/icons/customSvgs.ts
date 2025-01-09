import { type DefineComponent, h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import DiscordIcon from './DiscordIcon.vue';
import ModrinthFull from './ModrinthFull.vue';
import Bilibili from './Bilibili.vue';
import QuarkCloud from './QuarkCloud.vue';

const customSvgNameToComponent: Record<string, DefineComponent<{}, {}, any>> = {
  DiscordIcon,
  ModrinthFull,
  Bilibili,
  QuarkCloud,
};

export const customSVGs: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

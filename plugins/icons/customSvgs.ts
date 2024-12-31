import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import DiscordIcon from '@/plugins/icons/DiscordIcon.vue';
import ModrinthFull from '@/plugins/icons/ModrinthFull.vue';
import Bilibili from '@/plugins/icons/Bilibili.vue';

const customSvgNameToComponent: Record<string, any> = {
  DiscordIcon,
  ModrinthFull,
  Bilibili,
};

const customSVGs: IconSet = {
  component: (props: IconProps) =>
    h(customSvgNameToComponent[props.icon as string]),
};

export { customSVGs /* aliases */ };

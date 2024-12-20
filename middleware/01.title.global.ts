import { useNuxtApp } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const { t } = useNuxtApp().$i18n;
  if (to.meta.title && typeof to.meta.title === 'string') {
    const title = t(to.meta.title as string) + ' - Reden';
    useHead({
      title,
    });
  }
});

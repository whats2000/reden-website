<template>
  <link
    href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdmirror.com/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
    rel="stylesheet"
  />
  <div>
    <NuxtRouteAnnouncer />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>

<script lang="ts" setup>
import { getGlobalThis } from '@vue/shared';

onMounted(() => {
  if (document.referrer && !document.referrer.includes('redenmc.com')) {
    console.log('Referrer:', document.referrer);
    doFetchPost('/api/log/referrer', document.referrer || '');
  }
  if (import.meta.dev) {
    getGlobalThis().google_adtest = 'on';
  }
  const script = document.createElement('script');
  script.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4957320708232906';
  script.crossOrigin = 'anonymous';
  script.async = true;
  document.head.appendChild(script);
});
</script>

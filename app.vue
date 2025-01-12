<template>
  <link
    href="https://cdn.jsdmirror.com/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
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
  if (
    import.meta.env.PROD &&
    document.referrer &&
    !document.referrer.includes('redenmc.com')
  ) {
    console.log('Referrer:', document.referrer);
    doFetchPost('/api/log/referrer', document.referrer || '');
  }
  const script = document.createElement('script');
  if (import.meta.dev) {
    getGlobalThis().google_adtest = 'on';
    script.dataset.adbreakTest = 'on';
  }
  script.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4957320708232906';
  script.crossOrigin = 'anonymous';
  script.async = true;
  document.head.appendChild(script);
  (function (c: any, l: any, a: any, r: any, i: any) {
    let t: any, y: any;
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'psoi8pwdek');
});
</script>

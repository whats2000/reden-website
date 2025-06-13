<template>
  <v-alert
    v-if="!dismissed && locale === 'zh_cn'"
    color="amber-darken-2"
    variant="tonal"
    class="earning-banner mb-4"
    closable
    @click:close="dismissBanner"
  >
    <div class="d-flex align-center justify-space-between flex-wrap">
      <div class="banner-content d-flex align-center">
        <v-icon class="me-2 animate-bounce">mdi-cash-multiple</v-icon>
        <span class="banner-text">
          <strong>新功能</strong>
          自6月15日起，上传投影可获得收入分成。每次下载都能为您带来收益！
        </span>
      </div>
      <v-btn
        color="amber-darken-4"
        variant="elevated"
        class="ml-auto ml-md-4 mt-2 mt-md-0 banner-button"
        :to="localePath('/litematica/earning')"
      >
        了解更多
        <v-icon class="ms-1">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const localePath = useLocalePath();
const dismissed = ref(false);

function dismissBanner() {
  dismissed.value = true;
  // 可选：在localStorage中存储状态，这样刷新页面后不会再显示
  localStorage.setItem('earningBannerDismissed', 'true');
}

// 检查用户是否之前已关闭过横幅
onMounted(() => {
  if (localStorage.getItem('earningBannerDismissed') === 'true') {
    dismissed.value = true;
  }
});
</script>

<style scoped>
.earning-banner {
  border-left: 4px solid var(--v-amber-darken-3);
  position: relative;
  overflow: hidden;
}

.banner-button {
  white-space: nowrap;
}

.banner-text {
  font-size: 1rem;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 添加一些响应式样式 */
@media (max-width: 600px) {
  .banner-content {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>

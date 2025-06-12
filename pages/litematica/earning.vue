<script setup lang="ts">
import { Vue3Countup } from 'vue3-countup';
const downloads = ref(1000);
</script>

<template>
  <!-- 此 div 很重要，用来保证动画，所有内容必须包裹在其中 -->
  <div>
    在Reden，上传投影即可带来收入！
    您可以通过上传投影到Reden来赚取收入。每当有人下载您的投影，您将获得相应的奖励。我们会定期结算并将收入发放给您。
    通过上传投影，您不仅可以分享您的创作，还能获得实际的经济回报。每次下载都会为您带来收益。

    <v-card>
      <v-card-title> 我能获得多少收入？ </v-card-title>
      <v-card-text>
        输入您作品的下载量/播放量

        <v-text-field
          v-model="downloads"
          label="下载量/播放量"
          type="number"
          min="0"
          max="1000000"
          step="1"
          outlined
          class="mb-4"
        />

        您的预估收入为：

        <Vue3Countup
          :number="downloads * 0.04"
          :more-options="{ suffix: '元' }"
        />
        预测数据仅供参考，实际收入可能会有所不同。我们会根据平台的整体收入情况和您的投影质量来计算最终的奖励。
      </v-card-text>
    </v-card>

    Q&A

    <v-card>
      <v-card-text>
        <p>Q: 我可以上传任何类型的投影吗？</p>
        <p>A: 我们鼓励上传原创和高质量的投影，确保内容符合社区标准。</p>

        <p>Q: 收入是如何计算的？</p>
        <p>A: 收入基于下载量或播放量，具体比例会有所浮动。</p>

        <p>Q: 如何查看我的收入？</p>
        <p>A: 您可以在个人中心查看您的收入统计。</p>

        <p>Q: 如果我的投影被删除，我的收入会受到影响吗？</p>
        <p>
          A: 如果投影违反了社区标准或被举报，可能会导致收入暂停或取消。
          如果是您自己删除的投影，已经取得的收入将不会受到影响。
        </p>

        <p>Q: 用户下载是免费的吗？</p>
        <p>
          A: 是的，用户下载投影是免费的，但上传者可以通过下载量获得收入。
          我们通过广告以及其他合作方的支持来维持平台运营并支付奖励。
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>

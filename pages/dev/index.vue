<script lang="ts" setup>
const previewInfo = ref([
  'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
  'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
]);

const detailsInfo = ref({
  title: 'Details Title',
  poster: 'BelovedYaoo',
  designer: 'BelovedYaoo',
  publishedDate: '2025-01-19',
  version: ['1.15-1.18.2', '1.19-1.21.1'],
  designTags: ['Dark Oak Log'],
  featureTags: ['TNT Duping', 'Iron Golem Based'],
  praise: 21,
});

const descriptionInfo = ref({
  content:
    '《我的世界》（Minecraft）无疑是一款划时代的杰作，它不仅重新定义了沙盒游戏的边界，更在全球范围内掀起了一场创意与自由的革命。这款游戏以其独特的像素风格和无限的可能性，吸引了无数玩家沉浸其中，创造属于自己的世界。无论是孩童还是成年人，都能在《我的世界》中找到属于自己的乐趣与成就感。\n' +
    '\n' +
    '首先，《我的世界》的魅力在于它的开放性。游戏没有固定的目标或剧情，玩家可以自由选择自己的玩法。你可以成为一名探险家，深入地下洞穴寻找稀有矿石；也可以成为一名建筑师，用方块搭建出令人惊叹的宏伟建筑；甚至你可以成为一名农夫，种植作物、养殖动物，享受田园生活的宁静。这种自由度让每个玩家都能找到属于自己的游戏方式，真正实现了“我的世界，我做主”的理念。\n' +
    '\n' +
    '其次，《我的世界》的创造力是无穷的。游戏中的方块虽然简单，但通过玩家的巧手和想象力，它们可以组合成任何你能想到的东西。从宏伟的城堡到精密的红石电路，从复刻现实中的地标到创造完全虚构的奇幻世界，玩家们的作品一次又一次地刷新着人们对这款游戏的认知。这种创造力不仅体现在建筑上，还体现在游戏的各种模组（Mod）和自定义内容中。玩家可以通过模组扩展游戏的功能，甚至完全改变游戏的玩法，这使得《我的世界》始终保持着新鲜感和生命力。\n' +
    '\n' +
    '此外，《我的世界》还是一款极具教育意义的游戏。它通过游戏的方式培养了玩家的空间想象力、逻辑思维能力和团队合作精神。许多学校和教育机构甚至将《我的世界》引入课堂，用它来教授数学、物理、历史等学科知识。这种寓教于乐的方式不仅让学习变得有趣，还激发了学生的创造力和探索精神。\n' +
    '\n' +
    '最后，《我的世界》的社区文化也是其成功的重要因素。全球数百万玩家通过这款游戏连接在一起，分享他们的作品、经验和故事。无论是通过视频、直播还是论坛，玩家们都在不断交流、学习和进步。这种强大的社区凝聚力使得《我的世界》不仅仅是一款游戏，更成为一种文化现象。\n' +
    '\n' +
    '总的来说，《我的世界》是一款充满魔力与无限可能的游戏。它不仅为玩家提供了一个自由创造的平台，还通过其独特的玩法和社区文化，影响了整整一代人。无论你是追求冒险、创造还是社交，这款游戏都能满足你的需求。它不仅仅是一款游戏，更是一个充满奇迹的世界，等待着每一个玩家去探索和发现。',
});

// 添加一个 ref 来存储当前选中的大图片的 URL
const selectedImage = ref(previewInfo.value[0]);

// 点击图片时更新大图片的 URL
const updateSelectedImage = (image: string) => {
  selectedImage.value = image;
};
</script>

<template>
  <!-- 主容器 -->
  <div class="pa-16">
    <!-- 使用 flex 布局的容器 -->
    <v-row>
      <v-col cols="12" md="8" style="height: min-content">
        <!-- 预览 -->
        <div>
          <div class="text-h5 font-weight-bold">This is Preview Title</div>
          <v-divider style="margin: 12px 0" />
          <v-img
            :src="selectedImage"
            style="
              width: 100%;
              height: 100%;
              max-height: 400px;
              object-fit: contain;
              aspect-ratio: auto;
            "
          />
          <!-- 图片组容器 -->
          <v-slide-group
            class="pa-4"
            mandatory
            selected-class="bg-primary"
            show-arrows
          >
            <v-slide-group-item
              v-for="(image, index) in previewInfo"
              :key="index"
              v-slot="{ isSelected, toggle, selectedClass }"
            >
              <v-img
                :src="image"
                class="pr-2"
                min-width="100px"
                @click="
                  toggle;
                  updateSelectedImage(image);
                "
              />
            </v-slide-group-item>
          </v-slide-group>
        </div>
        <!-- 描述 -->
        <div class="mt-4">
          <div class="text-h5 font-weight-bold">There is Description</div>
          <v-divider style="margin: 12px 0" />
          <div class="my-5 text-pre-wrap">
            {{ descriptionInfo.content }}
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <!-- 摘要 -->
        <div class="details">
          <!-- 摘要头部 -->
          <div class="details-header">
            <div class="d-flex flex-row align-center justify-space-between">
              <div class="text-h5 font-weight-bold">
                {{ detailsInfo.title }}
              </div>
              <v-btn
                class="details-title-btn"
                icon="mdi-dots-horizontal"
                size="32"
                variant="text"
              />
            </div>
            <v-divider style="margin: 12px 0" />
          </div>
          <!-- 摘要内容 -->
          <div class="details-content">
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">发布者：</div>
              <div>{{ detailsInfo.poster }}</div>
            </div>
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">设计者：</div>
              <div>{{ detailsInfo.designer }}</div>
            </div>
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">发布时间：</div>
              <div>{{ detailsInfo.publishedDate }}</div>
            </div>
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">版本：</div>
              <v-chip
                v-for="(version, index) in detailsInfo.version"
                :key="index"
                size="small"
                style="margin-right: 8px"
              >
                {{ version }}
              </v-chip>
            </div>
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">设计标签：</div>
              <v-chip
                v-for="(tag, index) in detailsInfo.designTags"
                :key="index"
                size="small"
                style="margin-right: 8px"
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="d-flex mt-3">
              <div class="w-33 align-content-center">特性标签：</div>
              <v-chip
                v-for="(tag, index) in detailsInfo.featureTags"
                :key="index"
                size="small"
                style="margin-right: 8px"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>
          <!-- 摘要底部 -->
          <v-divider style="margin: 12px 0" />
          <div class="details-footer">
            <v-btn
              prepend-icon="mdi-thumb-up-outline"
              rounded="xl"
              variant="outlined"
            >
              {{ detailsInfo.praise }}
            </v-btn>
            <v-btn
              :size="36"
              icon="mdi-thumb-down-outline"
              rounded="xl"
              style="margin-left: 8px"
              variant="outlined"
            />
            <v-btn
              prepend-icon="mdi-bookmark-outline"
              rounded="xl"
              style="margin-left: 8px"
              variant="outlined"
            >
              收藏
            </v-btn>
            <v-btn
              prepend-icon="mdi-share-variant-outline"
              rounded="xl"
              style="margin-left: 8px"
              variant="outlined"
            >
              分享
            </v-btn>
          </div>
        </div>
        <!-- 下载 -->
        <div class="mt-4">
          <!-- 下载头部 -->
          <div>
            <div class="d-flex flex-row align-center justify-space-between">
              <div class="text-h5 font-weight-bold">Downloads</div>
              <div
                style="display: flex; flex-direction: row; align-items: center"
              >
                <v-icon icon="mdi-download" />
                <div class="text-h5 font-weight-bold">114514K</div>
              </div>
            </div>
            <v-divider style="margin: 12px 0" />
          </div>
          <!-- 下载内容 -->
          <div class="px-2">
            <v-card class="mx-auto" color="transparent" flat max-width="400">
              <v-card-text class="pa-0">
                <!-- 整体容器 -->
                <div class="d-flex">
                  <!-- 左侧图标容器 -->
                  <div class="d-flex align-center mr-3">
                    <v-icon color="grey-darken-2" size="large">
                      mdi-folder-outline
                    </v-icon>
                  </div>
                  <!-- 右侧内容区域 -->
                  <div class="d-flex flex-column flex-grow-1">
                    <!-- 标题行 -->
                    <span class="text-subtitle-1 font-weight-medium"
                      >76k Simple Dark Oak Farm</span
                    >
                    <!-- 底部信息行 -->
                    <div class="d-flex justify-space-between mt-1">
                      <span class="text-caption text--secondary"
                        >1.7-1.20.2</span
                      >
                      <span class="text-caption text--secondary"
                        >2 months ago</span
                      >
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

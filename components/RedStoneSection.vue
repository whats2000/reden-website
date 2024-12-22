<script lang="ts" setup>
import { onMounted, type Ref, ref } from 'vue';
import { useDisplay } from 'vuetify';

// todo: 不透明度渐变
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { size, imageTransparentPercentage, video } = defineProps({
  size: Number,
  imageTransparentPercentage: Number,
  leverOn: {
    type: Boolean,
    default: true,
  },
  video: String,
});
if (size === undefined || size < 1) {
  throw new Error('size must be greater than 0');
}
const sizz = Math.floor(size);

const { mobile } = useDisplay({
  mobileBreakpoint: 500,
});

let lightLine: Ref<Element | null> = ref(null);
let card: Ref<Element | null> = ref(null);
onMounted(() => {
  let observer = new IntersectionObserver(
    (it) => {
      it.forEach((entry) => {
        // eslint-disable-next-line no-constant-condition
        if (0) {
          console.log(
            'entry top: ',
            entry.target.getBoundingClientRect().top,
            'entry bottom: ',
            entry.target.getBoundingClientRect().bottom,
            'window innerHeight: ',
            window.innerHeight,
            'element',
            entry.target,
          );
        }
        if (
          entry.target.getBoundingClientRect().top > 100 ||
          entry.target.clientHeight > window.innerHeight
        ) {
          // only operate when the element is at the bottom of the screen
          if (entry.intersectionRatio == 1) {
            if (entry.target.classList.contains('invisible')) {
              entry.target.classList.add('light-line-animate');
              entry.target.classList.remove('invisible');
            }
            card.value?.classList?.add('card-active');
            card.value?.classList?.remove('card-invisible');
          } else {
            entry.target.classList.remove('light-line-animate');
            card.value?.classList?.remove('card-active');
          }
          if (entry.intersectionRatio == 0) {
            entry.target.classList.add('invisible');
            card.value?.classList?.add('card-invisible');
          }
        }
      });
    },
    {
      threshold: [0, 1],
    },
  );
  observer.observe(lightLine.value as Element);
});

const autoPlay = ref(true);
</script>

<template>
  <div class="line">
    <div ref="card">
      <v-card :min-height="sizz * 100 - 80" class="card">
        <template #title>
          <slot name="title" />
        </template>
        <template #subtitle>
          <slot name="subtitle" />
        </template>
        <template #text>
          <div class="my-text-wrap">
            <slot name="text" />
          </div>
        </template>
        <template #image>
          <div :class="{ 'bg-img-wrap': !mobile }">
            <slot v-if="video == undefined" name="image" />
            <video
              v-if="video != undefined"
              :autoplay="autoPlay"
              :src="video"
              height="220"
              loop
              muted
              playsinline
              style="object-fit: cover; object-position: center"
            />
          </div>
        </template>
        <template #actions>
          <!--
          <v-tooltip text="Auto play">
            <template #activator="{ props }">
              <v-btn
                :icon="autoPlay ? 'mdi-pause' : 'mdi-play'"
                @click="autoPlay = !autoPlay"
                v-bind="props">
              </v-btn>
            </template>
          </v-tooltip>
          -->
          <slot name="action" />
        </template>
      </v-card>
    </div>
    <div class="darkLine lineLayout">
      <div v-for="n in sizz" :key="n" class="photo r0"></div>
    </div>

    <div ref="lightLine" class="lightLine lineLayout invisible">
      <div v-for="n in sizz" v-show="leverOn" :key="n" class="photo r15"></div>
    </div>
  </div>
</template>

<style scoped>
.pistonBase {
  background: url('/image/homepage/section/piston_base.png') no-repeat;
  background-size: 100px 100px;
}

.pistonHead {
  position: absolute;
  background: url('/image/homepage/section/piston_head.png') no-repeat;
  background-size: 100px 100px;
}

.pistonSide {
  position: absolute;
  background: url('/image/homepage/section/piston_side.png') no-repeat;
  background-size: 100px 100px;
}

.photo {
  height: 100px;
  image-rendering: pixelated;
}

.r0 {
  background: url('/image/homepage/section/redstone_dust_0.png') no-repeat;
  background-size: 100px 100px;
  background-position-x: -30px;
}

.r15 {
  background: url('/image/homepage/section/redstone_dust_15.png') no-repeat;
  background-size: 100px 100px;
  background-position-x: -30px;
}

.lineLayout {
  display: flex;
  flex-direction: column;
}

.line {
  position: relative;
}

.lightLine {
  top: 0;
  position: absolute;
  width: 50px;
  height: 100%;
  mask: linear-gradient(var(--c0) -100%, var(--c1) 20%);
}

.invisible {
  opacity: 0;
}

@property --c0 {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

@property --c1 {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

@keyframes mask {
  0% {
    --c0: #fff;
    --c1: transparent;
  }
  100% {
    --c0: #fff;
    --c1: #fff;
  }
}

@keyframes light-line-bg {
}

.card {
  position: absolute;
  top: 2rem;
  margin-left: 40px;
  translate: 0;
  min-width: calc(100% - 80px);
  transform: none;
}

.card-active {
  transition: all 1s ease-out;
  transform: none;
  animation: 1s ease-in;
}

/*noinspection CssUnusedSymbol*/
.light-line-animate {
  animation: mask 1s ease-out alternate;
}

/*noinspection CssUnusedSymbol*/
.card-invisible {
  position: absolute;
  opacity: 0;
  transform: translateX(-10%);
}

.bg-img-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: end;
  left: 0;
}

.my-text-wrap {
  min-width: 200px;
  max-width: 350px;
  font-size: 16px;
}
</style>

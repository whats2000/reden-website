<script lang="ts" setup>
import { ref } from 'vue';
import { toast } from 'vuetify-sonner';

const localePath = useLocalePath();
type State = 'upload' | 'translation' | 'image' | 'under-review';
const states = ['upload', 'translation', 'image', 'under-review'] as const;
const state = ref<State>('upload');
watch(state, (newState) => {
  if (!availableSteps.value.includes(newState)) {
    availableSteps.value.push(newState);
  }
});
const availableSteps = ref<State[]>(['upload']);
const selectedFiles = ref<File[]>([]);
const uploading = ref(false);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');
const pictureInput = useTemplateRef<HTMLInputElement>('pictureInput');
const selectedPictures = ref<File[]>([]);
const imageUris = ref<string[]>([]);
const pictureError = ref<string | null>(null);
const machineId = ref<string>();

const triggerPictureInput = () => {
  if (pictureInput.value) {
    pictureInput.value.click();
  }
};

const handlePictureChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files) return;

  if (selectedPictures.value.length + files.length > 3) {
    pictureError.value = '最多只能上传3张图片';
    return;
  }
  pictureError.value = null;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 2 * 1024 * 1024) {
      pictureError.value = '图片大小不能超过2MB';
      selectedPictures.value = [];
      imageUris.value = [];
      return;
    }
  }
  selectedPictures.value.push(...Array.from(files));
  imageUris.value.push(
    ...Array.from(files).map((file) => URL.createObjectURL(file)),
  );
};

const removePicture = (index: number) => {
  selectedPictures.value.splice(index, 1);
  imageUris.value.splice(index, 1);
};

onMounted(() => {
  // 页面加载后清除input的值，防止重复上传相同文件不触发change事件
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  if (pictureInput.value) {
    pictureInput.value.value = '';
  }
});

const localizedData = ref<
  Record<
    string,
    {
      name?: string;
      summary?: string;
      description?: string;
    }
  >
>({
  en: {
    name: '',
    summary: '',
    description: '',
  },
  zh_cn: {
    name: '',
    summary: '',
    description: '',
  },
  zh_tw: {
    name: '',
    summary: '',
    description: '',
  },
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length ?? 0 >= 1) {
    selectedFiles.value = Array.from(target.files!);
    const obj = localizedData.value[language.value]!;
    if (!obj.name) {
      obj.name = selectedFiles.value[0].name.replace('.litematic', '');
      toast.success('Auto-filled name from file name');
    }
    if (!machineId.value) {
      machineId.value = obj.name!.toLowerCase().replace(/[^a-z0-9]/g, '');
      toast.success('Auto-filled id from name');
    }

    state.value = 'translation';
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
};

const { t, availableLocales, locale } = useI18n();
const language = ref<string>(locale.value);
const id = ref<string>('');
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const name = ref<string>();
const summary = ref<string>();
const description = ref<string>();
const file = ref<File>();
const image = ref<File>();
const imageUri = ref<string>();
const link = ref<string>();

const uploadingLocalizedData = ref(false);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadLocalizedData() {
  uploadingLocalizedData.value = true;
  await delay(2000);
  uploadingLocalizedData.value = false;
  state.value = 'image';
}

const minHeight = 490;
const backing = ref(false);
</script>
<template>
  <v-tabs v-model="state" color="primary">
    <v-tab
      v-for="item in states"
      :key="item"
      :disabled="!availableSteps.includes(item)"
      :value="item"
      class="text-capitalize"
    >
      {{ t(`upload.step.${item}`) }}
    </v-tab>
  </v-tabs>

  <v-card-text>
    <v-tabs-window v-model="state">
      <v-tabs-window-item value="upload">
        <v-card :min-height="minHeight" border class="rounded-xl">
          <v-card-title> {{ $t('upload.btn.upload_design') }}</v-card-title>
          <v-card-text class="text-center">
            <v-alert class="w-100" position="absolute" type="warning">
              Warning: This feature is still under development and may not work
              as expected. <br />警告：此功能仍在开发中，可能无法正常工作。
            </v-alert>
            <v-icon class="my-15" color="primary" size="100"
              >mdi-cloud-upload
            </v-icon>
            <div class="mt-4 opacity-60">
              <p>{{ $t('upload.desc.upload_schematic_or_world_save') }}</p>
              <p>{{ $t('upload.desc.design_supports_file_formats') }}</p>
              <p>{{ $t('upload.desc.design_maximal_file_size') }}</p>
            </div>
            <input
              ref="fileInput"
              multiple
              style="display: none"
              type="file"
              @change="handleFileChange"
            />
            <v-btn class="mt-4" color="primary" @click="fileInput?.click()">
              {{ $t('upload.btn.select_files') }}
            </v-btn>
            <p v-if="selectedFiles.length > 0" class="line-h-24">
              <span v-if="selectedFiles.length == 1">
                {{ selectedFiles[0].name }}
                ({{ formatFileSize(selectedFiles[0].size) }})
              </span>
              <span v-else-if="selectedFiles.length > 1">
                {{
                  $t('upload.desc.selected_count_files', {
                    count: selectedFiles.length,
                  })
                }}
              </span>
              <v-btn
                color="error"
                icon="mdi-close"
                size="xs"
                variant="outlined"
                @click="(selectedFiles = []), (availableSteps = ['upload'])"
              />
            </p>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item value="translation">
        <v-card :min-height="minHeight" border class="rounded-xl">
          <v-card-title>
            <v-row class="justify-space-between">
              <v-col class="mb-1 mb-md-3" cols="12" sm="6">
                <span class="text-h5">
                  {{ t('upload.step.translation') }}
                </span>
              </v-col>
              <v-col class="py-0 py-sm-2 pb-1" cols="12" sm="6">
                <div class="d-flex flex-row justify-end flex-wrap">
                  <div class="opacity-60 language-sel-tr">
                    {{ $t('upload.desc.please_select_which_language_to_edit') }}
                  </div>
                  <v-select
                    v-model="language"
                    :item-title="(i) => t(i)"
                    :item-value="(i) => i"
                    :items="availableLocales"
                    class="d-inline-block"
                    color="primary"
                    density="compact"
                    hide-details
                    max-width="200px"
                    outlined
                    variant="underlined"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="machineId"
              label="ID"
              color="primary"
              dense
              outlined
              variant="underlined"
            />
            <v-text-field
              v-model="localizedData[language].name"
              :label="$t('common.name')"
              color="primary"
              dense
              outlined
              variant="underlined"
              @update:model-value="console.log(localizedData)"
            />
            <v-text-field
              v-model="localizedData[language].summary"
              :label="$t('common.summary')"
              color="primary"
              dense
              outlined
              variant="underlined"
            />
            <v-textarea
              v-model="localizedData[language].description"
              :label="$t('common.description')"
              color="primary"
              dense
              outlined
              variant="underlined"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              :loading="uploadingLocalizedData"
              color="primary"
              variant="elevated"
              @click="uploadLocalizedData"
            >
              {{ $t('common.save') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item value="image">
        <v-card :min-height="minHeight" border class="rounded-xl">
          <v-card-title>{{ $t('upload.step.image') }}</v-card-title>
          <v-card-text class="text-center">
            <v-icon class="my-8" color="primary" size="100"
              >mdi-image-plus
            </v-icon>
            <div class="mt-4 opacity-60">
              <p>{{ $t('upload.desc.upload_images') }}</p>
              <p>{{ $t('upload.desc.maximum_size_per_image') }}</p>
            </div>
            <input
              ref="pictureInput"
              accept="image/*"
              multiple
              style="display: none"
              type="file"
              @change="handlePictureChange"
            />
            <v-btn
              class="mt-4 mx-4"
              color="primary"
              @click="triggerPictureInput"
            >
              {{ $t('upload.btn.select_files') }}
            </v-btn>
            <v-btn
              class="mt-4 mx-4"
              variant="outlined"
              @click="state = 'under-review'"
            >
              {{ $t('common.next') }}
            </v-btn>

            <div v-if="selectedPictures.length > 0" class="mt-4">
              <div
                v-for="(picture, index) in selectedPictures"
                :key="index"
                class="d-inline-block mr-4"
              >
                <v-img
                  :src="imageUris[index]"
                  class="border rounded-lg"
                  contain
                  max-height="150"
                  max-width="150"
                  min-height="100"
                  min-width="100"
                >
                  <template v-slot:placeholder>
                    <v-row
                      align="center"
                      class="fill-height ma-0"
                      justify="center"
                    >
                      <v-progress-circular
                        color="grey-lighten-1"
                        indeterminate
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-btn
                  absolute
                  color="error"
                  icon="mdi-close"
                  right
                  size="xs"
                  top
                  variant="outlined"
                  @click="removePicture(index)"
                />
              </div>
            </div>
            <div v-if="pictureError" class="mt-2 text-error">
              {{ pictureError }}
            </div>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item value="under-review">
        <v-card :min-height="minHeight" border class="rounded-xl">
          <v-card-title>
            {{ $t('upload.step.under-review') }}
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon class="my-8" color="green" size="100">
              mdi-clock-time-four-outline
            </v-icon>
            <div class="mt-4 opacity-60 text-center">
              <p>
                {{
                  $t(
                    'upload.desc.your_machine_design_is_under_review_please_wait_with_patience',
                  )
                }}
              </p>
              <p></p>
              <p>
                {{ $t('upload.desc.review_usually_takes_one_to_two_days') }}
              </p>
              <p>
                {{
                  $t(
                    'upload.desc.you_will_receive_an_email_notification_when_approved',
                  )
                }}
              </p>
            </div>
            <div class="mt-6">
              <p>
                {{
                  $t('upload.desc.please_contact_us_if_you_have_any_questions')
                }}
                <a class="router" href="mailto:info@redenmc.com"
                  >info@redenmc.com</a
                >
              </p>
            </div>
            <v-btn
              :href="localePath('/litematica')"
              :loading="backing"
              class="mt-6"
              color="primary"
              variant="outlined"
              @click="backing = true"
            >
              {{ $t('common.back') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card-text>
</template>

<style scoped>
.line-h-24 {
  line-height: 24px;
}

:deep(.v-slide-group__content) {
  justify-content: center;
}

.language-sel-tr {
  font-size: 0.9rem;
  line-height: 20px;
  padding-right: 7px;
  position: relative;
  top: 10px;
}
</style>

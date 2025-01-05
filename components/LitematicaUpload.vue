<script lang="ts" setup>
import { ref } from 'vue';
import { toast } from 'vuetify-sonner';
import type { MachineDef } from '~/pages/litematica/index.vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  editMode?: boolean;
  /**
   * Localized DTOs
   */
  machine?: Record<string, MachineDef> | null;
}>();
const emit = defineEmits<{
  'update:machine': [Record<string, Partial<MachineDef>>];
}>();
const { height } = useDisplay();

const localePath = useLocalePath();
type State = 'upload' | 'translation' | 'image' | 'under-review';
const states = ['upload', 'translation', 'image', 'under-review'] as const;
const state = ref<State>('upload');
watch(state, (newState) => {
  if (!availableSteps.value.includes(newState)) {
    availableSteps.value.push(newState);
  }
});
const refreshProps = () => {
  if (props.editMode) {
    state.value = 'translation';
  }
  localizedData.value = {
    ...localizedData.value,
    ...props.machine,
  };
  machineId.value = Object.entries(props.machine ?? {})?.[0]?.[1]?.key;
};
const availableSteps = ref<State[]>(
  props.editMode ? ['upload', 'translation', 'image'] : ['upload'],
);
const selectedFiles = ref<File[]>([]);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');
const pictureInput = useTemplateRef<HTMLInputElement>('pictureInput');
const selectedPictures = ref<File[]>([]);
const imageUris = ref<string[]>([]);
const pictureStepError = ref<string>();
const machineId = ref<string>();
const disallowedFilename = [
  '\r',
  '\n',
  '/',
  '\\',
  '\u0000',
  '\u000c',
  '`',
  '?',
  '*',
  '<',
  '>',
  '|',
  ':',
  "'",
  '"',
];
const uploading = ref(false);

async function doUploadAll() {
  uploading.value = true;
  if (!props.editMode || selectedFiles.value.length > 0) {
    if (
      selectedFiles.value.length != 1 ||
      !selectedFiles.value[0].name.endsWith('.litematic')
    ) {
      toast.error(
        t(
          'upload.desc.litematica_generator_only_support_uploading_1_litematica_file',
        ),
        {
          duration: 1e4,
        },
      );
      return;
    } else {
      const file = selectedFiles.value[0];
      const response = await doFetchPut(
        `/api/mc-services/yisibite/${machineId.value}`,
        file,
      );
      if (response.ok) {
        toast.success('File uploaded successfully');
        await delay(1e3);
      } else {
        await toastError(response, 'Failed to upload file');
        uploading.value = false;
        return;
      }
    }
  }
  for (const lang of availableLocales) {
    const data = localizedData.value[lang];
    console.log('uploading', lang, data);
    if (localizedData.value[lang]?.name) {
      localizedData.value[lang].key = machineId.value;
      const response = await doFetchPost(
        `/api/mc-services/yisibite/${machineId.value}/info/${lang}`,
        {
          name: data.name,
          summary: data.summary,
          description: data.description,
          link: null,
        },
      );
      if (response.ok) {
        toast.success(`${t(lang)} uploaded successfully`);
      } else {
        await toastError(response, 'Failed to upload info');
        uploading.value = false;
        return;
      }
    }
  }
  emit('update:machine', localizedData.value);

  state.value = 'under-review';
  availableSteps.value = ['under-review'];
  uploading.value = false;
}

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
    pictureStepError.value = '最多只能上传3张图片';
    return;
  }
  pictureStepError.value = undefined;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 2 * 1024 * 1024) {
      pictureStepError.value = '图片大小不能超过2MB';
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

const localizedData = ref<Record<string, Partial<MachineDef>>>({});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length ?? 0 >= 1) {
    selectedFiles.value = Array.from(target.files!);
    const obj = getLocalizedData(language.value);
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

const {
  error: isIdTakenResponse,
  status: isIdTakenStatus,
  refresh: checkIdTaken,
} = useFetch(() => `/api/mc-services/yisibite/${machineId.value}/info`, {
  dedupe: 'defer',
});

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

function getLocalizedData(language: string) {
  if (!localizedData.value[language]) {
    localizedData.value[language] = {};
  }
  return localizedData.value[language];
}

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

const minHeight = Math.max(490, height.value - 300);
const maxHeight = Math.max(490, height.value - 300);
const goingBack = ref(false);
refreshProps();
watch(props, refreshProps);
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
        <v-card
          :max-height="maxHeight"
          :min-height="minHeight"
          border
          class="rounded-xl"
        >
          <v-card-title> {{ $t('upload.btn.upload_design') }}</v-card-title>
          <v-card-text class="text-center">
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
            <div
              v-if="editMode"
              class="mt-2 mx-auto text-pre-line text-warning"
              style="max-width: 400px"
            >
              <v-icon>mdi-alert-circle</v-icon>
              {{ $t('upload.desc.existing_machine_design') }}
            </div>
          </v-card-text>
          <v-card-actions></v-card-actions>
        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item value="translation">
        <v-form fast-fail>
          <v-card
            :max-height="maxHeight"
            :min-height="minHeight"
            border
            class="rounded-xl overflow-y-scroll"
          >
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
                      {{
                        $t('upload.desc.please_select_which_language_to_edit')
                      }}
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
                :disabled="editMode"
                :rules="[
                  (v) => !!v || 'ID is required',
                  (v) =>
                    /^[a-z0-9\-_]+$/.test(v) ||
                    $t('upload.desc.id_can_only_contain'),
                  (_) =>
                    editMode ||
                    isIdTakenResponse?.statusCode === 404 ||
                    $t('upload.desc.id_is_taken'),
                ]"
                color="primary"
                label="ID"
                outlined
                variant="underlined"
                @update:model-value="() => editMode && checkIdTaken()"
              >
                <template v-if="!editMode" #details>
                  <template v-if="isIdTakenStatus === 'pending'">
                    Checking if this ID is taken...
                  </template>
                  <template v-else-if="isIdTakenResponse?.statusCode === 404">
                    <v-icon color="success">mdi-check</v-icon>
                    ID is available
                  </template>
                  <template v-else-if="!isIdTakenResponse?.statusCode">
                    <v-icon color="error">mdi-close</v-icon>
                    ID is taken
                  </template>
                </template>
              </v-text-field>
              <v-text-field
                v-model="getLocalizedData(language).name"
                :label="$t('common.name')"
                color="primary"
                outlined
                variant="underlined"
                @update:model-value="console.log(localizedData)"
                :rules="[
                  (v) =>
                    !disallowedFilename.some((c) => v.includes(c)) ||
                    $t('upload.desc.name_cannot_contain_special_characters'),
                ]"
              />
              <v-text-field
                v-model="getLocalizedData(language).summary"
                :label="$t('common.summary')"
                color="primary"
                hide-details
                outlined
                variant="underlined"
              />
              <v-textarea
                v-model="getLocalizedData(language).description"
                :label="$t('common.description')"
                color="primary"
                hide-details
                outlined
                variant="underlined"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="uploadingLocalizedData"
                block
                color="primary"
                variant="elevated"
                @click="uploadLocalizedData"
              >
                {{ $t('common.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-tabs-window-item>

      <v-tabs-window-item value="image">
        <v-card
          :max-height="maxHeight"
          :min-height="minHeight"
          border
          class="rounded-xl"
        >
          <v-card-title>{{ $t('upload.step.image') }}</v-card-title>
          <v-card-text class="text-center">
            <v-alert
              v-if="pictureStepError"
              :title="pictureStepError"
              class="mt-2 left-0 right-0 z-10"
              position="absolute"
              type="error"
            />
            <v-icon class="my-8" color="primary" size="100">
              mdi-image-plus
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
            <br />
            <v-btn
              :loading="uploading"
              class="mt-4 mx-4 text-none"
              variant="outlined"
              @click="doUploadAll"
            >
              {{
                editMode
                  ? $t('upload.btn.finish_editing')
                  : $t('upload.btn.start_uploading')
              }}
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
                  <template #placeholder>
                    <v-row
                      align="center"
                      class="fill-height ma-0"
                      justify="center"
                    >
                      <v-progress-circular
                        color="grey-lighten-1"
                        indeterminate
                      />
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
          </v-card-text>
        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item value="under-review">
        <v-card
          :max-height="maxHeight"
          :min-height="minHeight"
          border
          class="rounded-xl"
        >
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
              :loading="goingBack"
              class="mt-6"
              color="primary"
              variant="outlined"
              @click="goingBack = true"
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

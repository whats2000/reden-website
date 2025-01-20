<script lang="ts" setup>
import {
  doFetchGet,
  doFetchPut,
  fetchUser,
  type Profile,
  toastError,
} from '@/utils/constants';
import { toast } from 'vuetify-sonner';
import { useAppStore } from '@/store/app';
import UserProfileCard from '~/components/profile/UserProfileCard.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const localePath = useLocalePath();
definePageMeta({
  title: 'reden.title.my_account',
  needLogin: true,
});

let user = ref<Profile>();
const loading = ref(true);
// webhook
const needInstallWebhook = ref(false);
if (import.meta.client) {
  fetchUser(user).then(() => (loading.value = false));
  doFetchGet('/api/account/activity').then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        console.log(data);
      });
    } else {
      if (response.status === 412) {
        needInstallWebhook.value = true;
      } else if (response.status === 404) {
        // nothing
      } else {
        toastError(response);
      }
    }
  });
}

function logout() {
  doFetchGet('/api/account/logout')
    .then((response) => {
      if (response.ok) {
        router.push('/');
        toast.success('Logout Successful', {
          description: 'You have been logged out',
          duration: 1000,
        });
      } else {
        return Promise.reject(response);
      }
    })
    .catch((e) => toastError(e, 'Failed to logout'));
  useAppStore().logout();
}

function installWebhook() {
  doFetchPut('/api/github/reden-webhook', {})
    .then((response) =>
      response.ok ? response.json() : Promise.reject(response),
    )
    .then((data: { action: string; redirect?: string | null }) => {
      if (data.action === 'confirm' && data.redirect) {
        location.href = data.redirect;
      }
      console.log(data);
    })
    .catch((e) => toastError(e, 'Failed to update webhook'));
}

const personalToken = ref('');
const tokenExpiresAt = ref<Date>();
const tokenScopes = ref<string[]>(['backup/*', 'me']);
function getPersonalToken() {
  if (!tokenExpiresAt.value) {
    toast('请选择一个有效期', {
      cardProps: { color: 'red' },
    });
    return;
  }
  doFetchPut('/api/account/access-token', {
    note: `Personal Token ${new Date().toISOString()}`,
    scope: tokenScopes.value,
    expiresAt: Number(tokenExpiresAt.value!),
  }).then((response) => {
    if (response.ok) {
      response.text().then((data) => {
        personalToken.value = data;
      });
    } else {
      toastError(response);
    }
  });
}
</script>

<template>
  <v-banner
    v-if="needInstallWebhook"
    :stacked="true"
    border
    color="info"
    icon="mdi-information-variant"
  >
    <v-banner-text>
      You have not installed the webhook yet. Please install the webhook to
      enable the activity tracking feature.
    </v-banner-text>
    <template #actions>
      <v-btn color="primary" @click="installWebhook">
        Install Webhook

        <v-dialog activator="parent">
          <v-card>
            <v-card-title>Install Webhook</v-card-title>
            <v-card-text> Redirecting...</v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
      <v-btn color="gray" @click="needInstallWebhook = false"> Dismiss</v-btn>
    </template>
  </v-banner>

  <div class="d-flex flex-wrap flex-row w-100">
    <div>
      <v-skeleton-loader
        v-show="loading"
        type="card-avatar"
        width="300"
      ></v-skeleton-loader>
      <UserProfileCard v-show="!loading" :apply-preference="false" :user="user">
        <template #actions>
          <v-row>
            <v-col>
              <v-btn
                class="text-none"
                color="secondary"
                href="/"
                rounded="lg"
                :to="localePath('/home/edit')"
                variant="outlined"
              >
                {{ $t('profile.editProfile') }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </UserProfileCard>
      <v-btn color="primary" @click="logout"> Logout</v-btn>
    </div>

    <div class="flex-column">
      <v-btn>
        生成个人密钥
        <v-dialog activator="parent" max-width="600">
          <v-form v-if="!personalToken" @submit.prevent="getPersonalToken">
            <v-card>
              <v-card-title>生成个人密钥</v-card-title>
              <v-card-text>
                选择一个有效期，生成一个个人密钥，用于备份和恢复数据
                <v-row>
                  <v-col>
                    密钥有效期至
                    {{ tokenExpiresAt?.toLocaleDateString() }}
                  </v-col>
                  <v-col>
                    <v-spacer />
                    <v-btn color="primary">
                      选择日期
                      <v-dialog activator="parent" max-width="330">
                        <template #default="{ isActive }">
                          <v-card>
                            <v-locale-provider locale="zhHans">
                              <v-date-picker
                                show-adjacent-months
                                v-model="tokenExpiresAt"
                                :max="
                                  new Date(
                                    Date.now() + 1000 * 60 * 60 * 24 * 60,
                                  )
                                "
                                :min="new Date()"
                              ></v-date-picker>
                            </v-locale-provider>
                            <v-card-actions>
                              <v-btn
                                @click="isActive.value = false"
                                color="red"
                                variant="outlined"
                              >
                                关闭
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-dialog>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col> 权限范围 </v-col>
                  <v-col>
                    <v-select
                      v-model="tokenScopes"
                      :items="[
                        'me',
                        'me/update',
                        'me/*',
                        'backup',
                        'backup/onedrive',
                        'backup/*',
                      ]"
                      multiple
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn type="submit"> 生成</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-card v-if="personalToken">
            <v-card-title>个人密钥</v-card-title>
            <v-card-text>
              <v-alert color="error">
                请妥善保管个人密钥，不要泄露给他人
              </v-alert>
              {{ personalToken }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="personalToken = ''"> Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
      <v-btn
        :to="localePath('/x-backup/me')"
        class="text-none"
        color="secondary"
        rounded="lg"
        variant="outlined"
      >
        {{ $t('profile.my_backup') }}
      </v-btn>
      <v-timeline></v-timeline>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import UserProfileCard from '@/components/UserProfileCard.vue';
import { useRoute } from 'vue-router';
import type { MachineDef } from '~/pages/litematica/index.vue';

const route = useRoute();
const { t } = useI18n();
const { data: user, error } = await useFetchUserGet(
  route.params.username as string,
);
useHead({
  title: `${user?.value?.username ?? t('reden.user_not_found')} - Reden`,
});

watch(user, () => {
  useHead({
    title: `${user?.value?.username ?? t('reden.user_not_found')} - Reden`,
  });
});

const { data: machines } = await useFetch<MachineDef[]>(
  `/api/mc-services/litematica/by-author`,
  {
    query: {
      author: user.value?.username ?? '',
      pageSize: 10,
    },
  },
);
</script>

<template>
  <v-card v-if="!user">
    <v-card-title>
      <h1>Invalid User</h1>
    </v-card-title>
    <v-card-text>
      <p>
        Invalid user id:
        {{ route.params.username }}
      </p>
      <p>
        {{ error?.error }}
      </p>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-alert v-show="!user" dismissible type="error">
      Cannot find user
    </v-alert>
    <UserProfileCard v-show="user" :can-edit="false" :user="user" />
  </v-card>
</template>

<style scoped></style>

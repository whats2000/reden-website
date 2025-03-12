<script lang="ts" setup>
const email = ref('');
const captcha = ref<Captcha>();
const emailSent = ref(false);
const localePath = useLocalePath();
const { t } = useI18n();

async function submit() {
  console.log(email);
  const response = await doFetchPost('/api/account/forgot-password', {
    email: email.value,
    captcha: captcha.value,
  });
  if (response.ok) {
    emailSent.value = true;
  } else {
    await toastError(response);
  }
}
</script>

<template>
  <v-container class="content-common">
    <v-dialog
      max-width="550"
      :model-value="emailSent"
      close-delay=""
      activator="parent"
    >
      <v-card>
        <v-card-title>{{ t('reset_pass.email_sent') }}</v-card-title>
        <v-card-text>
          <p>{{ t('reset_pass.email_sent_desc') }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :to="localePath('/login')">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Forgot Password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="email"
                label="Email"
                required
                type="email"
              />
              <common-captcha v-model="captcha" />
              <v-btn :disabled="!captcha?.token" color="primary" type="submit">
                {{ t('reset_pass.submit') }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>

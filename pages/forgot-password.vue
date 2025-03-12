<script lang="ts" setup>
const email = ref('');
const captcha = ref<Captcha>();

function submit() {
  console.log(email);
  doFetchPost('/api/account/forgot-password', {
    email: email.value,
    captcha: captcha.value,
  });
}
</script>

<template>
  <v-container class="content-common">
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
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>

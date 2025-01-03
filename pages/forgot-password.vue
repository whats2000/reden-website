<script setup lang="ts">
const email = ref('');

function submit() {
  console.log(email);
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
              ></v-text-field>
              <v-btn type="submit" color="primary">Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>

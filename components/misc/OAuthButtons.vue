<template>
  <div class="d-flex flex-column" style="gap: 8px">
    <v-btn
      :block="true"
      :href="'/api/oauth/github?redirect_url=' + encodeURI('/login')"
      variant="outlined"
      class="oauth"
      height="48"
    >
      <v-icon left>mdi-github</v-icon>
      Github
    </v-btn>
    <v-btn
      :block="true"
      :href="'/api/oauth/microsoft?redirect_url=' + encodeURI('/login')"
      variant="outlined"
      class="oauth"
      height="48"
    >
      <v-icon left>custom:Microsoft</v-icon>
      Microsoft
    </v-btn>
    <v-btn
      :block="true"
      :href="'/api/oauth/google?redirect_url=' + encodeURI('/login')"
      variant="outlined"
      class="oauth"
      height="48"
    >
      <v-icon left>custom:Google</v-icon>
      Google
    </v-btn>
  </div>
</template>

<style scoped>
.oauth {
  height: 48px;
  font-size: 18px;
  text-transform: none;
}
</style>

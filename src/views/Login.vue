<template>
  <v-row class="justify-center blue-grey lighten-5">
    <v-col class="loginForm" lg="3" sm="12">
      <login-form />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/auth/LoginForm.vue';

@Component({
  components: {
    LoginForm,
  },
})
export default class extends Vue {}
</script>

<style lang="scss">
.loginForm {
  padding: 20px;
}
</style>
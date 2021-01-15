<template>
  <v-form
    class="form-vertical-gap"
    v-model="valid"
    @submit.prevent="createUser"
  >
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      type="text"
      label="Email address"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      type="password"
      label="Password"
    ></v-text-field>
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :disabled="loading || !valid"
    >
      Register
    </v-btn>
    <v-btn block large depressed>Cancel</v-btn>
  </v-form>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { authModule } from '../store';

import { User } from '@/api';

@Component
export default class extends Vue {
  email: string = '';

  password: string = '';

  error: string = '';

  valid: boolean = false;

  loading: boolean = false;

  async createUser() {
    await User.register(this.email, this.password);
  }

  emailRules = [
    (v: string) =>
      v8n().string().not.empty().test(v) || 'Email address required',

    (v: string) =>
      v8n()
        .pattern(/\S+@\S+\.\S+/)
        .test(v) || 'Email address must be valid',
  ];
}
</script>

<style lang="scss">
.login,
.logged-in {
  max-width: 320px;
  margin: 6rem auto;
}
</style>

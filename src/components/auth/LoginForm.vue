<template>
  <v-form class="form-vertical-gap" @submit.prevent="login" v-model="valid">
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
      Login
    </v-btn>
    <v-btn
      block
      large
      depressed
      class="amber white--text"
      @click="forgotPassword"
      >Forgot Password</v-btn
    >
    <v-btn block large depressed class="pink white--text" @click="registration">
      Register
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { authModule, snackModule } from '@/store';
import { ApiError } from '@/api';
import colors from 'vuetify/lib/util/colors';

@Component
export default class extends Vue {
  email: string = '';

  password: string = '';

  confirmPassword: string = '';

  loading: boolean = false;

  valid: boolean = false;

  error: string = '';

  emailRules = [
    (v: string) =>
      v8n().string().not.empty().test(v) || 'Email address required',

    (v: string) =>
      v8n()
        .pattern(/\S+@\S+\.\S+/)
        .test(v) || 'Email address must be valid',
  ];

  passwordRules = [
    (v: string) => v8n().string().not.empty().test(v) || 'Password required',
    (v: string) =>
      v8n().string().minLength(8).test(v) ||
      'Password must be at least 8 chars',
    (v: string) =>
      v8n().not.numeric().minLength(8).test(v) ||
      'Password must include non-numeric chars',
  ];

  async login() {
    this.loading = true;
    try {
      await authModule.login({ email: this.email, password: this.password });
      this.error = '';
      this.$router.push({ name: 'home' });
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }

  forgotPassword() {
    this.$router.push({ name: 'forgot-password' });
  }

  registration() {
    this.$router.push({ name: 'registration' });
  }
}
</script>
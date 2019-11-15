<template>
  <v-form
    class="form-vertical-gap"
    @submit.prevent="setPassword"
    v-model="valid"
    ref="form"
  >
    <v-alert type="success" v-if="success">
      Thank you, you may now login with your new password.
    </v-alert>
    <v-alert type="error" v-else-if="error">
      Sorry, the following error has occured: <strong>{{ error }}</strong>
    </v-alert>
    <v-alert type="info" v-else-if="queryOk">
      Reset password for <strong>{{ email }}</strong>
    </v-alert>
    <v-alert type="error" v-else>
      Could not compute.
    </v-alert>
    <v-text-field
      v-model="password1"
      :rules="passwordRules"
      type="password"
      label="New password"
      v-if="!success"
    ></v-text-field>
    <v-text-field
      v-model="password2"
      :rules="passwordRules2"
      type="password"
      label="Confirm new password"
      v-if="!success"
    ></v-text-field>
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :disabled="loading || !valid"
      v-if="!success"
    >
      Continue
    </v-btn>
    <v-btn block large depressed @click="home">
      Back to home
    </v-btn>
  </v-form>
</template>

<script lang="ts">
// @ts-ignore
import v8n from 'v8n';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { PasswordResetConfirmation } from '@/api';

interface VuetifyForm extends Vue {
  validate: () => boolean;
}

@Component
export default class extends Vue {
  valid: boolean = false;

  loading: boolean = false;

  success: boolean = false;

  password1: string = '';

  password2: string = '';

  error: string = '';

  passwordRules = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || 'Password required',
    (v: string) =>
      v8n()
        .string()
        .minLength(8)
        .test(v) || 'Password must be at least 8 chars',
    (v: string) =>
      v8n()
        .not.numeric()
        .minLength(8)
        .test(v) || 'Password must include non-numeric chars',
  ];

  get passwordRules2() {
    return [(v: string) => this.password1 === v || 'Passwords do not match'];
  }

  get uid() {
    return typeof this.$route.query.uid === 'string'
      ? this.$route.query.uid
      : '';
  }

  get token() {
    return typeof this.$route.query.token === 'string'
      ? this.$route.query.token
      : '';
  }

  get email() {
    return typeof this.$route.query.email === 'string'
      ? atob(this.$route.query.email)
      : '';
  }

  get queryOk() {
    return !!this.uid && !!this.token && !!this.email;
  }

  async setPassword() {
    this.loading = true;
    try {
      await PasswordResetConfirmation.setPassword(
        this.uid,
        this.token,
        this.password1,
        this.password2,
      );
      this.error = '';
      this.success = true;
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  home() {
    this.$router.push({ name: 'home' });
  }

  @Watch('password1')
  @Watch('password2')
  passwordChanged() {
    (this.$refs.form as VuetifyForm).validate();
  }
}
</script>

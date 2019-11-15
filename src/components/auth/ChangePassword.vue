<template>
  <v-form
    class="form-vertical-gap"
    @submit.prevent="changePassword"
    v-model="valid"
    ref="form"
  >
    <v-alert type="success" v-if="success">
      Password changed successfully.
    </v-alert>
    <v-alert type="error" v-else-if="error">
      Sorry, the following error has occured: <strong>{{ error }}</strong>
    </v-alert>
    <v-text-field
      v-model="currentPassword"
      :rules="passwordRules"
      type="password"
      label="Current password"
    ></v-text-field>
    <v-text-field
      v-model="password1"
      :rules="passwordRules"
      type="password"
      label="New password"
    ></v-text-field>
    <v-text-field
      v-model="password2"
      :rules="passwordRules2"
      type="password"
      label="Confirm new password"
    ></v-text-field>
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :disabled="loading || !valid"
    >
      Change Password
    </v-btn>
  </v-form>
</template>

<script lang="ts">
// @ts-ignore
import v8n from 'v8n';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { authModule } from '@/store';

interface VuetifyForm extends Vue {
  validate: () => boolean;
}

@Component
export default class extends Vue {
  valid: boolean = false;

  loading: boolean = false;

  success: boolean = false;

  currentPassword: string = '';

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

  async changePassword() {
    if (!authModule.user) {
      return;
    }

    this.loading = true;
    try {
      await authModule.user.changePassword(
        this.currentPassword,
        this.password1,
      );
      this.error = '';
      this.success = true;
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  @Watch('password1')
  @Watch('password2')
  passwordChanged() {
    (this.$refs.form as VuetifyForm).validate();
  }
}
</script>

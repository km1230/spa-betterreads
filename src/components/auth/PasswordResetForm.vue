<template>
  <v-form
    class="form-vertical-gap"
    @submit.prevent="submit"
    v-model="valid"
    v-if="!complete"
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
    <v-btn
      block
      large
      depressed
      color="primary"
      type="submit"
      :disabled="loading || !valid"
    >
      Next
    </v-btn>
    <v-btn block large depressed @click="home">Cancel</v-btn>
  </v-form>
  <div class="form-vertical-gap" v-else>
    <v-alert type="success">
      Thank you, an email has been sent to <strong>{{ email }}.</strong> Please
      check your email.
    </v-alert>
    <v-btn block large depressed @click="home">Back to home</v-btn>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import v8n from 'v8n';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PasswordReset } from '@/api';

@Component
export default class extends Vue {
  email: string = '';

  loading: boolean = false;

  valid: boolean = false;

  complete: boolean = false;

  error: string = '';

  emailRules = [
    (v: string) =>
      v8n()
        .string()
        .not.empty()
        .test(v) || 'Email address required',

    (v: string) =>
      v8n()
        .pattern(/\S+@\S+\.\S+/)
        .test(v) || 'Email address must be valid',
  ];

  async submit() {
    this.loading = true;
    try {
      const result = await PasswordReset.resetPassword(this.email);
      if (!result) {
        this.error = 'Whoops! An unknown error has occured';
      } else {
        this.error = '';
        this.complete = true;
      }
    } catch (e) {
      this.error = e.response.errors[0].detail;
    } finally {
      this.loading = false;
    }
  }

  home() {
    this.$router.push({ name: 'home' });
  }
}
</script>

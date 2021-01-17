<template>
  <v-col cols="12" lg="6" offset-lg="3">
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
        ref="input1"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        type="password"
        label="Password"
        ref="input2"
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        type="password"
        label="Confrim Password"
        ref="input3"
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
      <v-btn block large depressed @click="clearForm">Cancel</v-btn>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import v8n from 'v8n';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { authModule } from '@/store';
import { User } from '@/api';

@Component
export default class extends Vue {
  email: string = '';

  password: string = '';

  confirmPassword: string = '';

  error: string = '';

  valid: boolean = false;

  loading: boolean = false;

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

  confirmPasswordRules = [
    (v: string) =>
      v8n().string().not.empty().test(v) || 'Please confirm password',

    (v: string) => this.persistPassword(v) || 'Passwords not matched',
  ];

  async createUser() {
    this.loading = true;
    try {
      let user = await User.register(this.email, this.password);
      await authModule.login({ email: this.email, password: this.password });
      this.error = '';
      this.$router.push({ name: 'home' });
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }

  persistPassword(v: string) {
    const p = this.$refs.input2 as Vue & { value: string };
    return v === p.value;
  }

  clearForm() {
    [...Array(3).keys()].map((k) => {
      const ref = this.$refs['input' + (k + 1).toString()] as Vue & {
        value: string;
      };
      ref.value = '';
    });
  }
}
</script>

<style lang="scss">
.login,
.logged-in {
  max-width: 320px;
  margin: 6rem auto;
}
</style>

<template>
  <div class="auth">
    <component :is="resetComponent"></component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PasswordResetForm from '@/components/auth/PasswordResetForm.vue';
import PasswordResetConfirmForm from '@/components/auth/PasswordResetConfirmForm.vue';

@Component({
  components: {
    PasswordResetForm,
    PasswordResetConfirmForm,
  },
})
export default class extends Vue {
  password: string = '';

  get resetComponent() {
    return this.$route.name === 'set-password'
      ? 'password-reset-confirm-form'
      : 'password-reset-form';
  }

  forgotPassword() {
    this.$router.push({ name: 'forgot-password' });
  }
}
</script>

<style lang="scss">
.auth {
  max-width: 320px;
  margin: 6rem auto;
}
</style>

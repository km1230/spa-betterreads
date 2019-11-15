<template>
  <div class="home">
    <div class="login" v-if="!isLoggedIn">
      <login-form></login-form>
    </div>
    <div v-else class="logged-in">
      <div class="text-center">
        Logged in as <strong>{{ username }}</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/auth/LoginForm.vue';
import { authModule } from '../store';

@Component({
  components: {
    LoginForm,
  },
})
export default class extends Vue {
  get username() {
    return authModule.user ? authModule.user.email : '';
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
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

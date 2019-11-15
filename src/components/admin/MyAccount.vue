<template>
  <div class="my-account">
    <div class="change-password">
      <change-password></change-password>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator';
import ChangePassword from '@/components/auth/ChangePassword.vue';

@Component({
  components: { ChangePassword },
})
export default class extends Vue {}
</script>

<style lang="scss">
.change-password {
  margin: 6rem auto;
  max-width: 320px;
}
</style>

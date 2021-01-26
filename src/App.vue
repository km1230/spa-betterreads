<template>
  <v-app class="v-app-override">
    <div v-if="ready">
      <page-header></page-header>
      <router-view></router-view>
      <page-footer></page-footer>
    </div>
    <v-overlay v-else color="white">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="showSnackbar" :timeout="-1">
      <div>
        <div v-for="(snack, i) in snacks" :key="i">
          {{ snack }}
        </div>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PageHeader from '@/components/PageHeader.vue';
import PageFooter from '@/components/PageFooter.vue';
import { authModule, snackModule } from '@/store';
import { ApiError } from '@/api';

@Component({
  components: {
    PageHeader,
    PageFooter,
  },
})
export default class extends Vue {
  get ready(): boolean {
    return authModule.ready;
  }

  get isLoggedIn(): boolean {
    return authModule.isLoggedIn;
  }

  get nextQuery(): string {
    return typeof this.$route.query.next === 'string'
      ? this.$route.query.next
      : '';
  }

  get snacks(): string[] {
    return snackModule.snacks;
  }

  get showSnackbar(): boolean {
    return snackModule.snacksVisible;
  }

  mounted() {
    console.log(process.env);
  }

  @Watch('isLoggedIn')
  @Watch('nextQuery')
  isLoggedInChange() {
    // redirect once logged in if next query param is set
    if (this.isLoggedIn && this.nextQuery) {
      this.$router.replace(this.nextQuery);
    }
  }
}
</script>

<style lang="scss">
a {
  text-decoration: none;
}
.v-app-override {
  display: block;
}
</style>

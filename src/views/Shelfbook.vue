<template>
  <div class="blue-grey lighten-4">
    <p>{{ error }}</p>
    <v-row v-for="shelf in userShelves" :key="shelf.id" class="shelfRow">
      <v-card class="shelfCard teal white--text">
        <v-card-title>{{ shelf.name }}</v-card-title>
      </v-card>
      <v-row>
        <v-col sm="12" lg="3" v-for=""></v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';

@Component({})
export default class extends Vue {
  shelves: Shelf[] = [];
  shelfbooks: Shelfbook[] = [];
  error: string = '';

  async getUserShelves() {
    try {
      let { data } = await Shelf.where({ user: this.currentUser?.id }).all();
      if (data) this.shelves = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getUserShelfbooks(shelfId: string) {
    try {
      let { data } = await Shelfbook.where({
        shelf__user: this.currentUser?.id,
      }).all();
      if (data) this.shelfbooks = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get userShelfbooks() {
    return this.shelfbooks;
  }

  get userShelves() {
    return this.shelves;
  }

  get currentUser() {
    return authModule.user;
  }

  mounted() {
    this.getUserShelves();
  }
}
</script>

<style lang="scss">
.shelfRow {
  padding: 20px;
}
.shelfCard {
  width: 100%;
}
</style>
<template>
  <v-row>
    <v-col sm="12" class="d-flex justify-center teal white--text pa-4">
      <h2>Create a shelf</h2>
    </v-col>
    <v-col sm="12" lg="4" offset-lg="4">
      <v-card color="grey lighten-4 pa-4 mt-4" elevation="10">
        <v-card-title>Name your new shelf</v-card-title>
        <v-form @submit.prevent="createNewShelf">
          <v-card-text>
            <v-text-field
              v-model="newShelfName"
              label="Shelf name"
              :counter="20"
              type="text"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn block class="blue-grey darken-4 white--text" type="submit"
              >Create</v-btn
            >
          </v-card-actions>
          <v-card-actions>
            <v-btn
              block
              class="blue-grey lighten-4 mt-2"
              @click="
                shelves.length > 0 ? (needCreateShelf = false) : clearForm
              "
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Shelf } from '@/api';
import { authModule } from '@/store';

@Component({ name: 'OtherReview' })
export default class extends Vue {
  @Prop() readonly needCreateShelf: boolean;
  @Prop() readonly shelves: Shelf[];
  newShelfName: string = '';
  error: string = '';

  async createNewShelf() {
    try {
      await Shelf.newShelf(this.newShelfName, this.currentUser);
      this.$emit('shelfAdded');
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  clearForm() {
    document.querySelectorAll('input').forEach((i) => {
      i.value = '';
    });
  }

  get currentUser() {
    return authModule.user;
  }
}
</script>

<style lang="scss">
</style>
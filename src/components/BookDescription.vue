<template>
  <!-- Book detail -->
  <v-col lg="7" sm="12">
    <v-row class="my-2">
      <v-sheet
        color="blue-grey darken-1"
        class="white--text shape"
        elevation="10"
        shaped
      >
        <v-icon class="left white--text">mdi-account-box-outline</v-icon
        >{{ book ? book.author : '' }}
      </v-sheet>
      <v-sheet color="grey lighten-2" class="shape" elevation="10" shaped>
        <v-icon class="left white--text">mdi-image-album</v-icon>{{ category }}
      </v-sheet>
    </v-row>
    <v-img
      class="bookImage"
      contain
      :light="true"
      :src="book && book.cover ? book.cover : 'https://picsum.photos/200/300'"
    />
    <div class="bookDescription blue-grey lighten-5">
      <v-btn
        text
        elevation="10"
        class="orange darken-1 white--text mr-3 round-md"
        v-if="isStaff"
        @click="goEditBook(book.id)"
      >
        <v-icon class="left white--text">mdi-circle-edit-outline</v-icon>Edit
      </v-btn>
      {{ book ? book.description : '' }}
    </div>
  </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book } from '@/api';
import { authModule } from '@/store';

@Component({ name: 'BookDescription' })
export default class extends Vue {
  @Prop() book: Book;
  @Prop() category: string = '';

  goEditBook(id: string) {
    this.$router.push({ name: 'edit-book', params: { id } });
  }

  get isStaff() {
    return authModule.isStaff;
  }
}
</script>

<style lang="scss">
</style>

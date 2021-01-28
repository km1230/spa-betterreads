<template>
  <v-card class="card" elevation="10">
    <v-card-title class="black white--text">{{ book.title }}</v-card-title>
    <v-card-subtitle class="mt-3">{{ book.category.name }}</v-card-subtitle>
    <div class="img-container">
      <v-img
        width="100%"
        max-height="300"
        :contain="true"
        :src="book.cover ? book.cover : 'https://picsum.photos/200/300'"
      />
    </div>
    <!-- Only authenticated user can view book detail -->
    <v-card-actions v-if="isLoggedIn">
      <v-btn
        block
        class="blue-grey darken-1 white--text"
        @click="getBookDetail(book.id)"
      >
        Book Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book } from '@/api';
import { authModule } from '@/store';

@Component({})
export default class extends Vue {
  @Prop() readonly book: Book;

  getBookDetail(id: string) {
    this.$router.push({ name: 'book-detail', params: { id } });
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }
}
</script>
<template>
  <div class="blue-grey lighten-4">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-row class="mainRow">
      <v-col sm="12" class="teal white--text d-flex justify-center">
        <h2>All Books</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" sm="12" v-for="book in books" :key="book.id" ref="cardCol">
        <v-card class="card">
          <v-card-title class="black white--text"
            >{{ book.title }} - {{ book.author }}</v-card-title
          >
          <v-card-subtitle class="mt-4">{{
            book.category.name
          }}</v-card-subtitle>
          <v-img
            height="300"
            :contain="true"
            :src="book.cover ? book.cover : 'https://picsum.photos/200/300'"
          />
          <!-- Only authenticated user can view book detail -->
          <v-card-actions v-if="isLoggedIn">
            <v-btn
              block
              class="blue white--text"
              @click="getBookDetail(book.id)"
            >
              Book Detail
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category } from '@/api';
import { authModule } from '@/store';

@Component({
  name: 'AllBooks',
})
export default class extends Vue {
  books: Book[] | null = null;
  error: string = '';
  snackbar: boolean = false;

  async getAllBooks() {
    try {
      let { data } = await Book.includes('category').all();
      this.books = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  getBookDetail(id: string) {
    this.$router.push({ name: 'book-detail', params: { id } });
  }

  toggleSnackbar() {
    this.snackbar = !this.snackbar;
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  get isStaff() {
    return authModule.isStaff;
  }

  mounted() {
    this.getAllBooks();
  }
}
</script>

<style lang="scss">
.error {
  background-color: red;
  color: white;
  font-size: 1rem;
  padding: 10px;
}
.mainRow {
  padding: 20px;
}
.card {
  height: 500px;
}
.description {
  padding: 20px;
}
</style>

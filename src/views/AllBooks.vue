<template>
  <div class="main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <!-- Page title and search button -->
    <v-row class="pa-4">
      <v-col sm="12" class="teal white--text d-flex justify-center">
        <h2>All Books</h2>
        <v-btn
          outlined
          color="grey lighten-2"
          class="ml-lg-2"
          @click="toggleSearch"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Search bar -->
    <v-row v-if="searching">
      <v-col sm="12" lg="4" offset-lg="4" class="grey lighten-4 pa8">
        <v-text-field
          v-model="searchValue"
          placeholder="Search book..."
          id="navSearch"
          color="blue-grey darken-4"
          @input="searchBook"
        />
      </v-col>
    </v-row>
    <!-- Show books -->
    <v-row class="pa-4">
      <v-col lg="4" sm="12" v-for="book in books" :key="book.id">
        <book-card :book="book" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category } from '@/api';
import { authModule } from '@/store';
import BookCard from '@/components/BookCard.vue';

@Component({
  name: 'AllBooks',
  components: {
    BookCard,
  },
})
export default class extends Vue {
  books: Book[] | null = null;
  error: string = '';
  snackbar: boolean = false;
  searching: boolean = false;
  searchValue: string = '';

  async getAllBooks() {
    try {
      let { data } = await Book.includes('category').all();
      this.books = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async searchBook() {
    try {
      let { data } = await Book.where({ search: this.searchValue }).all();
      if (data) this.books = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  toggleSnackbar() {
    this.snackbar = !this.snackbar;
  }

  toggleSearch() {
    this.searching = !this.searching;
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
.main {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}
.error {
  background-color: red;
  color: white;
  font-size: 1rem;
  padding: 10px;
}
.card {
  height: 400px !important;
}
.img-container {
  height: 300px;
  padding: 0%;
  margin: 0%;
  display: flex;
  align-content: center;
}
</style>

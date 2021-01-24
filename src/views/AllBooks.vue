<template>
  <div class="blue-grey lighten-4">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-row class="mainRow">
      <v-col lg="4" sm="12" v-for="book in books" :key="book.id" ref="cardCol">
        <v-card class="card">
          <v-img height="300" src="https://picsum.photos/200/300" />
          <v-card-title>{{ book.title }} - {{ book.author }}</v-card-title>
          <v-card-subtitle>{{ book.category.name }}</v-card-subtitle>
          <v-card-text class="description">{{ book.description }}</v-card-text>
          <v-card-actions class="cardAction" v-if="isLoggedIn">
            <router-link :to="{ name: 'book-detail', params: { id: book.id } }">
              <v-btn class="blue white--text">Book Detail</v-btn>
            </router-link>
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

@Component({})
export default class extends Vue {
  books: Book[] | null = null;
  error: string = '';

  async getAllBooks() {
    try {
      let { data } = await Book.includes('category').all();
      this.books = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
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

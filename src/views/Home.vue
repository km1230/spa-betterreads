<template>
  <div class="home blue-grey lighten-5">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>

    <!-- Show their/public shelves when users logged in -->
    <div class="trending">
      <div class="text-center greeting">
        Welcome back <strong>{{ username.replace(/@.*/, '') }}!</strong>
      </div>
      <div class="text-center readingHeadline teal white--text">
        <h3>People are reading...</h3>
      </div>
      <v-row class="mt-4">
        <v-col
          lg="4"
          sm="12"
          v-for="book in books.slice(0, 3)"
          :key="book.id"
          ref="cardCol"
        >
          <v-card>
            <v-card-title class="black white--text">{{
              book.title
            }}</v-card-title>
            <v-card-subtitle class="mt-3">{{ book.author }}</v-card-subtitle>
            <v-img
              class="bookCovers"
              contain
              max-height="400px"
              :src="book.cover ? book.cover : 'https://picsum.photos/200/300'"
            />

            <v-card-actions v-if="isLoggedIn">
              <v-btn
                block
                class="blue white--text"
                @click="goBookDetail(book.id)"
                >Book Detail</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/auth/LoginForm.vue';
import { authModule } from '../store';
import { Book, Shelf } from '@/api';

@Component({
  name: 'Home',
  components: {
    LoginForm,
  },
})
export default class extends Vue {
  books: Book[] = [];
  error = '';

  async getBooks(included: any[]) {
    if (included.length !== 0) {
      included.forEach(async (v) => {
        try {
          let { data } = await Book.find(v.id);
          this.books.push(data);
        } catch (e) {
          this.error = e.response
            ? e.response.errors[0].detail
            : 'Unknown error';
        }
      });
    } else {
      try {
        let { data } = await Book.all();
        this.books = data;
      } catch (e) {
        this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
      }
    }
  }

  async getShelves() {
    try {
      let response = await Shelf.includes('books').all();
      if (response.raw.included) {
        this.getBooks(response.raw.included);
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  goBookDetail(id: string) {
    this.$router.push({ name: 'book-detail', params: { id } });
  }

  get username() {
    return authModule.user ? authModule.user.email : '';
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  mounted() {
    if (authModule.isLoggedIn) {
      this.getShelves();
    } else {
      this.$router.push({ name: 'all-books' });
    }
  }
}
</script>

<style lang="scss">
.home {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}
.greeting {
  padding: 20px;
}
.readingHeadline {
  padding: 20px;
}
.col {
  flex-basis: auto;
}
.bookCovers {
  justify-items: center;
}
</style>

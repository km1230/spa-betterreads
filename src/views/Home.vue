<template>
  <div class="home blue-grey lighten-5">
    <v-alert v-if="error" type="error">{{error}}</v-alert>
    <!-- Show carousel to annonymus users -->
    <div class="red white--text">{{ this.error }}</div>
    <div class="carousel" v-if="!isLoggedIn">
      <v-carousel continuous :cycle="true" :show-arrows="false" :max="5">
        <!-- Max 3 books are shown -->
        <v-carousel-item
          v-for="book in books.slice(0, 3)"
          reverse-transition="fade-transition"
          transition="fade-transition"
          :key="book.id"
        />
      </v-carousel>
    </div>

    <!-- Show their/public shelves when users logged in -->
    <div v-else class="trending">
      <div class="text-center greeting">
        Welcome back <strong>{{ username.replace(/@.*/, '') }}!</strong>
      </div>
      <div class="text-center readingHeadline">People are reading...</div>
      <v-row>
        <v-col
          lg="4"
          sm="12"
          v-for="book in books"
          :key="book.id"
          ref="cardCol"
        >
          <v-card>
            <v-card-title>{{ book.title }}</v-card-title>
            <v-card-text>{{ book.author }}</v-card-text>
            <v-card-actions class="cardAction" v-if="isLoggedIn">
              <router-link
                :to="{ name: 'book-detail', params: { id: book.id } }"
              >
                <v-btn class="blue white--text">Book Detail</v-btn>
              </router-link>
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
      this.getBooks([]);
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
.cardAction {
  justify-content: flex-end;
}
.col {
  flex-basis: auto;
}
</style>

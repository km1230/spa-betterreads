<template>
  <div class="main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>

    <!-- Show their/public shelves when users logged in -->
      <v-row class="pa-4">        
        <v-col class="teal white--text d-flex justify-center">
          <h2>People Are Reading...</h2>          
        </v-col>
        <v-col class="text-center">
          <p>Welcome back <strong>{{ username.replace(/@.*/, '') }}!</strong></p>
        </v-col>
      </v-row>
      <v-row class="pa-4">
        <v-col
          lg="4"
          sm="12"
          v-for="book in books.slice(0, 4)"
          :key="book.id"
        >
          <v-card class="card">
            <v-card-title class="black white--text">{{
              book.title
            }}</v-card-title>
            <v-card-subtitle class="mt-3">{{ book.author }}</v-card-subtitle>
            <div class="img-container">
              <v-img
                width="100%"
                max-height="300"
                :contain="true"
                :src="book.cover ? book.cover : 'https://picsum.photos/200/300'"
              />
            </div>
            <v-card-actions v-if="isLoggedIn">
              <v-btn
                block
                class="blue-grey darken-1 white--text"
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
.main {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}
.col {
  flex-basis: auto;
}
.card {
  height: 500px !important;
}
.img-container {
  height: 300px;
  padding: 0%;
  margin: 0%;
  display: flex;
  align-content: center;
}
</style>

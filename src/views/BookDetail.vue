<template>
  <div>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <!-- page main content -->
    <div class="bookTitle teal text-center white--text">
      <v-icon dense large>mdi-book-open-page-variant</v-icon>&nbsp;{{
        this.book ? this.book.title : ''
      }}
    </div>
    <v-container>
      <v-row>
        <!-- BookDescription component -->
        <book-description :book="book" :category="category" />

        <!-- Other reviews -->
        <v-col lg="5" sm="12">
          <other-review
            v-if="showReview"
            :bookReviews="allBookReviews"
            :currentUser="currentUser"
            :userHasBook="isUserHasBook"
            @deleteReview="deleteReviewContent"
            @toggleReview="toggleReview"
          />

          <!-- Add Book To Shelf -->
          <add-to-shelf 
            v-else 
            :currentUser="currentUser"
            :userHasBook="isUserHasBook"
            @cancel="toggleReview" 
            @createShelf="addToNewShelf($event)" 
            @shelfChosen="addToChosenShelf($event)"
            @removeShelfbook="delShelfBook($event)"
          />

          <v-divider />

          <!-- User review -->
          <user-review
            :bookReviews="allBookReviews"
            :currentUser="currentUser"
            @reviewUpdated="getReviews"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Book, Category, Review, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';
import BookDescription from '@/components/BookDescription.vue';
import OtherReview from '@/components/OtherReview.vue';
import UserReview from '@/components/UserReview.vue';
import AddToShelf from '@/components/AddToShelf.vue';

@Component({
  name: 'BookDetail',
  components: {
    BookDescription,
    OtherReview,
    UserReview,
    AddToShelf,
  },
})
export default class extends Vue {
  book: Book | null = null;
  category: string = '';
  bookReviews: Review[] = [];
  userHasBook: boolean = false;
  showReview: boolean = true;
  error = '';

  async bookDetail() {
    try {
      let { data } = await Book.find(this.$route.params.id);
      this.book = data;
      let cat = await Category.find(data.category.id);
      this.category = cat.data.name;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getReviews() {
    try {
      let { data } = await Review.where({ book: this.$route.params.id }).all();
      this.bookReviews = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async deleteReviewContent() {
    try {
      if(this.currentUser) {
        let { data } = await Review.where({ user: this.currentUser.id }).first();
        if (data) {
          data.content = '';
          await data.save();
        }
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.getReviews();
    }
  }

  async findUserShelfbook() {
    try {
      let { data } = await Shelfbook.where({
        book: this.$route.params.id,
      })
        .includes('shelf')
        .all();
      let userShelfbook = data.filter(
        (sb) => sb.shelf.user.id === this.currentUser?.id,
      );
      this.userHasBook = userShelfbook.length > 0 ? true : false;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  toggleReview() {
    this.showReview = !this.showReview;
  }

  async addToNewShelf(shelfName: string) {
    try {      
      if(this.currentUser)
      {        
        let shelf = await Shelf.newShelf(shelfName, this.currentUser);
        if (shelf) await this.addBookToShelf(shelf)
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async addToChosenShelf(shelves: Shelf[]) {
    for await (let shelf of shelves) {
      this.addBookToShelf(shelf)
    }
  }

  async addBookToShelf(shelf: Shelf) {
    try {
      if(shelf && this.book) {
        let result = await Shelfbook.newShelfbook(shelf, this.book, this.currentUser?.id);      
      }      
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.findUserShelfbook()
      this.toggleReview()
    }
  }

  async delShelfBook(sb: Shelfbook) {    
    try {
      if(sb) await Shelfbook.delShelfBook(sb.id);
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.findUserShelfbook()
      this.toggleReview()
    }
  }

  get isUserHasBook() {
    return this.userHasBook;
  }

  get allBookReviews() {
    return this.bookReviews;
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  get currentUser() {
    return authModule.user;
  }

  mounted() {
    this.bookDetail();
    this.getReviews();
    this.findUserShelfbook();
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
.bookTitle {
  max-width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 2rem;
}
.shape {
  padding: 10px;
  font-size: 0.8rem;
  margin: 20px;
  max-width: 130px;
  word-wrap: break-word;
}
.bookImage {
  max-height: 50vh;
}
.bookDescription {
  margin-top: 20px;
  padding: 20px;
}
.rating {
  align-items: center;
  margin-bottom: 10px;
}
.rateBar {
  max-width: 50% !important;
}
.reviews {
  margin-top: 20px;
  font-style: oblique;
}
.reviewsContent {
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
}
.addToShelf {
  margin: 20px;
}
.leaveReview {
  margin: 20px;
}
</style>
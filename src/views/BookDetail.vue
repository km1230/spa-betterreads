<template>
  <div>
    <!-- page main content -->
    <div class="bookTitle teal text-center white--text">
      <v-icon dense large>mdi-book-open-page-variant</v-icon>&nbsp;{{
        (this.book) ? this.book.title : ''
      }}
    </div>
    <v-container>
      <v-row>
        <!-- BookDescription component -->
        <book-description :book="book" :category="category" />

        <!-- Other reviews -->
        <v-col lg="5" sm="12">
          <other-review
            :bookReviews="allBookReviews"
            :currentUser="currentUser"
            :userShelves="userAllShelves"
            @deleteReview="deleteReviewContent"
          />

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

@Component({
  components: {
    BookDescription,
    OtherReview,
    UserReview,
  },
})
export default class extends Vue {
  book: Book | null = null;
  category: string = '';
  bookReviews: Review[] = [];
  error: '';
  userShelves: Shelf[] = [];

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
      let { data } = await Review.all();
      this.bookReviews = data.filter(
        (r) => r.book.id === this.$route.params.id,
      );
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async deleteReviewContent() {
    try {
      if (this.userReview !== null) {
        let { data } = await Review.find(this.userReview.id);
        data.content = '';
        await data.save();
      }
      this.getReviews();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getUserShelf() {
    try {
      let { data } = await Shelf.all();
      let shelves = data.filter((s) => s.user.id === this.currentUser?.id);
      this.userShelves = shelves.length > 0 ? shelves : [];
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async addToShelf() {
    try {
      this.userAllShelves.filter(s => {
        // Kavie change this pls
      });
    } catch(e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get allBookReviews() {
    return this.bookReviews
  }

  get userAllShelves() {
    return this.userShelves
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
  }
}
</script>

<style lang="scss">
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
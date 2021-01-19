<template>
  <div>
    <div class="bookTitle teal text-center white--text">
      <v-icon dense large>mdi-book-open-page-variant</v-icon>&nbsp;{{
        this.bookTitle
      }}
    </div>
    <v-container>
      <v-row>
        <v-col lg="7" sm="12">
          <v-row>
            <v-sheet
              color="blue-grey darken-1"
              class="white--text shape"
              elevation="10"
              shaped
            >
              <v-icon class="left white--text">mdi-account-box-outline</v-icon
              >{{ this.bookAuthor }}
            </v-sheet>
            <v-sheet
              color="purple light-4 white--text"
              class="shape"
              elevation="10"
              shaped
            >
              <v-icon class="left white--text">mdi-image-album</v-icon
              >{{ this.bookCategory }}
            </v-sheet>
          </v-row>
          <v-img
            class="bookImage"
            contain
            :light="true"
            src="https://picsum.photos/200/300"
          />
          <div class="bookDescription blue-grey lighten-5">
            {{ this.bookDescription }}
          </div>
        </v-col>
        <v-col lg="5" sm="12">
          <v-row class="rating">
            <v-col sm="6">
              <v-rating
                hover
                :length="5"
                :size="50"
                :value="3"
                class="rateBar"
                ref="rateBar"
                :readonly="isLoggedIn ? false : true"
              ></v-rating>
            </v-col>
            <v-col sm="6" v-if="isLoggedIn">
              <v-btn class="">
                Add to Shelf<v-icon color="dark right">mdi-cards-heart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <div class="reviews">
            <v-icon>mdi-comment-text-multiple</v-icon> Reviews
            <div
              class="reviewsContent amber accent-4 white--text"
              v-for="review in bookReviews.slice(0, 3)"
              :key="review.id"
            >
              {{ review.content || '' }}
            </div>
          </div>
          <v-divider />
          <form class="leaveReview" @submi.prevent="" v-if="isLoggedIn">
            <v-col sm="12">
              <v-icon class="reviewIcon">mdi-account-voice</v-icon>
            </v-col>
            <v-col sm="12">
              <v-text-field
                outlined
                clearable
                class="reviewField"
                ref="reviewField"
                placeholder="leave reivew..."
              />
            </v-col>
            <v-btn class="blue white--text" block type="submit"
              >Post Review</v-btn
            >
          </form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category, Review } from '@/api';
import { authModule } from '@/store';

@Component({})
export default class extends Vue {
  bookTitle: string = '';
  bookAuthor: string = '';
  bookCategory: string = '';
  bookDescription: string = '';
  bookReviews: Review[] = [];
  error: '';

  async bookDetail() {
    try {
      let { data } = await Book.find(this.$route.params.id);
      this.bookTitle = data.title;
      this.bookAuthor = data.author;
      this.bookDescription = data.description;
      let cat = await Category.find(data.category.id);
      this.bookCategory = cat.data.name;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async review() {
    try {
      let { data } = await Review.all();
      this.bookReviews = data.filter((r) => {
        if (r.book.id === this.$route.params.id) return r;
      });
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  mounted() {
    this.bookDetail();
    this.review();
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
  font-size: 1.5rem;
  align-items: center;
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
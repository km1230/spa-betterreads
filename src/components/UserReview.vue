<template>
  <div>
    <v-row class="rating">
      <v-col sm="4">
        <v-icon class="reviewIcon" left>mdi-account-voice</v-icon> My review
      </v-col>
      <v-col sm="8">
        <v-rating
          hover
          :length="5"
          :size="30"
          :value="Number(userRate)"
          class="rateBar"
          ref="rateBar"
          background-color="blue-grey darken-1"
          color="blue-grey darken-1"
          @input="updateRating"
        ></v-rating>
      </v-col>
    </v-row>
    <form class="leaveReview" @submit.prevent="updateReviewContent">
      <v-col sm="12">
        <v-text-field
          outlined
          clearable
          v-model="newReviewContent"
          class="reviewField"
          ref="reviewField"
          :placeholder="userReviewContent"
        />
      </v-col>
      <v-btn class="blue-grey darken-1 white--text" block type="submit"
        >Post Review</v-btn
      >
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Book, Review } from '@/api';
import { authModule } from '@/store';

@Component({ name: 'UserReview' })
export default class extends Vue {
  @Prop() readonly bookReviews: Review[];
  @Prop() readonly currentUser: User;
  newReviewContent: string = ''; // for text-field v-model

  async updateRating(star: string) {
    try {
      // update existing review
      if (this.userReview !== null) {
        let { data } = await Review.find(this.userReview.id);
        data.rate = star;
        await data.save();
      } else {
        // create new review and add rate
        let { data } = await Book.find(this.$route.params.id);
        await Review.newReview(this.currentUser, '', star, data);
      }
      this.reviewUpdated();
    } catch (e) {
      this.$emit('hasError', e);
    }
  }

  async updateReviewContent() {
    try {
      // update existing review
      if (this.userReview !== null) {
        let { data } = await Review.find(this.userReview.id);
        data.content = this.newReviewContent;
        await data.save();
      } else {
        // create new review and add content
        let { data } = await Book.find(this.$route.params.id);
        await Review.newReview(
          this.currentUser,
          this.newReviewContent,
          '',
          data,
        );
      }

      // refresh all reviews
      this.reviewUpdated();
    } catch (e) {
      this.$emit('hasError', e);
    }
  }

  reviewUpdated() {
    this.$emit('reviewUpdated');
  }

  get userReview() {
    let existingReivew = this.bookReviews.filter(
      (r) => r.user.id === this.currentUser?.id,
    );
    if (existingReivew.length === 1) {
      return existingReivew[0];
    } else {
      return null;
    }
  }

  get userRate() {
    if (this.userReview !== null && this.userReview.rate !== '') {
      return this.userReview.rate;
    } else {
      return '';
    }
  }

  get userReviewContent() {
    if (this.userReview !== null && this.userReview.content !== '') {
      return `You said: ${this.userReview.content}`;
    } else {
      return '// say something about this book';
    }
  }
}
</script>
<template>
  <div>
    <!-- average rating -->
    <v-row class="rating">
      <v-col sm="3">
        <v-icon>mdi-chart-bell-curve-cumulative</v-icon>Avg. Rate
      </v-col>
      <v-col sm="7">
        <v-rating
          hover
          :length="5"
          :size="30"
          :value="avgRating"
          class="rateBar"
          background-color="blue-grey darken-1"
          color="blue-grey darken-1"
          ref="rateBar"
          :readonly="true"
        ></v-rating>
      </v-col>
      <!-- add to shelf -->
      <v-col sm="2">
        <v-btn
          depressed
          outlined
          :color="userHasBook ? 'pink' : 'grey'"
          @click="hideReview"
        >
          <v-icon>mdi-cards-heart</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <!-- review content -->
    <div class="reviews">
      <v-icon>mdi-comment-text-multiple</v-icon> Reviews
      <div v-for="review in bookReviews.slice(0, 3)" :key="review.id">
        <div
          class="reviewsContent orange darken-1 white--text"
          v-if="review.content !== ''"
        >
          {{ review.content }}
          <v-btn
            depressed
            text
            v-if="review.user.id === currentUser.id"
            @click="deleteReview"
          >
            <v-icon right darken>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Review } from '@/api';
import { authModule } from '@/store';

@Component({ name: 'OtherReview' })
export default class extends Vue {
  @Prop() readonly bookReviews: Review[];
  @Prop() readonly currentUser: User;
  @Prop() readonly userHasBook: boolean;
  error: string = '';

  deleteReview() {
    this.$emit('deleteReview');
  }

  hideReview() {
    this.$emit('toggleReview');
  }

  get avgRating() {
    let rate = 0;
    this.bookReviews.forEach((r) => {
      rate += Number(r.rate);
    });
    return Math.floor(rate / this.bookReviews.length);
  }
}
</script>

<style lang="scss">
</style>
<template>
  <div class="my-book">
    <div class="my-book__image" @click="myClick">
      <v-img contain src="https://picsum.photos/200/300"></v-img>
    </div>
    <div class="my-book__details">
      <slot :title="book.title" :random="myRandomThing">
        <h2>{{ book.title }}</h2>
        <div>{{ book.author }}</div>
        <div>hi here</div>
      </slot>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Book, Category, Review, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';

@Component({})
export default class extends Vue {
  @Prop({ required: true }) readonly book: Book;

  myRandomThing = Math.random();

  myClick() {
    this.$emit('my-event', this.myRandomThing);
  }
}
</script>

<style lang="scss">
</style>
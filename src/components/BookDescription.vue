<template>
  <!-- Book detail -->
  <v-col lg="7" sm="12">
    <v-row>
      <v-sheet
        color="blue-grey darken-1"
        class="white--text shape"
        elevation="10"
        shaped
      >
        <v-icon class="left white--text">mdi-account-box-outline</v-icon
        >{{ (book) ? book.author : '' }}
      </v-sheet>
      <v-sheet
        color="purple light-4 white--text"
        class="shape"
        elevation="10"
        shaped
      >
        <v-icon class="left white--text">mdi-image-album</v-icon>{{ category }}
      </v-sheet>
    </v-row>
    <v-img
      class="bookImage"
      contain
      :light="true"
      src="https://picsum.photos/200/300"
    />
    <div class="bookDescription blue-grey lighten-5">
      {{ (book) ? book.description : ''  }}
    </div>
  </v-col>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book } from '@/api';

@Component({})
export default class extends Vue {
  @Prop() book: Book;
  @Prop() category: string = '';
}
</script>

<style lang="scss">
</style>

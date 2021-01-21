<template>
  <!-- Book detail -->
  <div class="addToShelfCard">
    <v-card elevation="2" class="cardContent blue-grey lighten-5">
      <v-card-title>Add to Book Shelf</v-card-title>
      <v-card-subtitle>Which shelf?</v-card-subtitle>
      <v-card-text>
        <v-checkbox
          v-for="shelf in userShelves"
          :key="shelf.id"
          :label="shelf.name"
          :value="shelf.id"
          v-model="selected"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn block class="blue white--text" @click="chooseingShelf"
          >Yes</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn block class="amber white--text" @click="clearSelection"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Shelf } from '@/api';

@Component({})
export default class extends Vue {
  @Prop() readonly userShelves: Shelf[];
  selected: string[] = [];

  chooseingShelf() {
    this.$emit('shelfChosen', this.selected);
  }

  clearSelection() {
    this.selected = [];
    this.$emit('cancel');
  }
}
</script>

<style lang="scss">
.addToShelfCard {
  margin-bottom: 20px;
}
.cardContent {
  padding: 20px;
}
</style>

<template>
  <v-snackbar
    v-model="snackbarStatus"
    :centered="true"
    :timeout="-1"
    :shelfbook="shelfbook"
  >
    <v-row v-if="shelfbook">
      <v-col sm="12">
        <h3>{{ shelfbook.book.title }}</h3>
      </v-col>
      <v-divider />
      <v-col sm="12">
        <v-checkbox
          v-for="s in status"
          :key="status.indexOf(s)"
          v-model="selected"
          :label="s"
          :value="s"
        />
      </v-col>
      <v-col sm="12">
        <v-btn
          block
          color="orange darken-1"
          @click="$emit('updateStatus', [shelfbook.id, selected])"
          >Confirm</v-btn
        >
      </v-col>
      <v-col sm="12">
        <v-btn block color="grey lighten-1" @click="closeSnackbar">Close</v-btn>
      </v-col>
    </v-row>
    <v-row v-else></v-row>
  </v-snackbar>
</template>

<script lang="ts">
import { Shelfbook } from '@/api';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'ShelfbookSnack',
})
export default class extends Vue {
  @Prop() readonly shelfbook: Shelfbook;
  @Prop() readonly status: string[];
  @Prop() readonly snackbarStatus: boolean;
  selected: string = '';

  closeSnackbar() {
    this.selected = '';
    this.$emit('toggleSnackbar', this.shelfbook.id);
  }

  @Watch('shelfbook', { immediate: true })
  shelfbookChanged() {
    this.selected = this.shelfbook.status;
  }
}
</script>

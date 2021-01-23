<template>
  <div class="blue-grey lighten-4 main">
    <v-alert>{{ error }}</v-alert>
    <v-row v-for="shelf in userShelves" :key="shelf.id" class="shelfRow">
      <v-col sm="12">
        <v-card class="shelfCard teal white--text">
          <v-card-title>{{ shelf.name }}</v-card-title>
        </v-card>
      </v-col>      
      <v-col sm="12" lg="3" v-for="shelfbook in userShelfbooks" :key="shelfbook.id">
        <v-card v-if="shelfbook.shelf.id === shelf.id">
          <v-card-title>{{ shelfbook.book.title }}</v-card-title>
          <v-card-subtitle>{{ shelfbook.book.author }}</v-card-subtitle>
          <v-divider />
          <v-card-text class="status">
            <v-icon v-if="shelfbook.status === 'wish'" color="yellow lighten-1">mdi-bookmark-multiple</v-icon>
            <v-icon v-if="shelfbook.status === 'reading'" color="light-green darken-1">mdi-book-open-variant</v-icon>
            <v-icon v-if="shelfbook.status === 'read'" color="light-blue darken-1">mdi-book-check</v-icon>
            {{ shelfbook.status }}
          </v-card-text>
          <v-card-actions>              
            <v-btn block class="blue white--text" @click="$router.push({ name: 'book-detail', params: { id: shelfbook.book.id } })">Book Detail</v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn block class="amber white--text" @click="toggleShowDetail(shelfbook.id)">Change Status</v-btn>
          </v-card-actions>    
        </v-card>        
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';

@Component({})
export default class extends Vue {
  shelves: Shelf[] = [];
  shelfbooks: Shelfbook[] = [];
  status: string[] = ['Wish', 'Reading', 'Read'];
  selected: string = '';
  error: string = '';

  async getUserShelves() {
    try {
      let { data } = await Shelf.where({ user: this.currentUser?.id }).all();
      if (data) {
        this.shelves = data;
        for await (let shelf of this.shelves) {
          await this.getUserShelfbooks(shelf.id)
        }
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getUserShelfbooks(shelfId: string) {
    try {
      let { data } = await Shelfbook.includes('book').where({
        shelf__user: this.currentUser?.id,
      }).all();
      if (data) this.shelfbooks = data;
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get userShelfbooks() {
    return this.shelfbooks;
  }

  get userShelves() {
    return this.shelves;
  }

  get currentUser() {
    return authModule.user;
  }

  mounted() {
    this.getUserShelves();
  }
}
</script>

<style lang="scss">
.main {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}
.shelfRow {
  padding: 20px;
}
.shelfCard {
  width: 100%;
}
.status {
  background-color: #3E2723;
  color: white!important;
  font-size: 1rem;
  padding: 20px!important;
  margin-top: 10px;
}
</style>
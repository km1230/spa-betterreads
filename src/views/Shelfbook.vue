<template>
  <div class="main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <!-- Shelf row -->
    <div v-if="!doNeedCreateShelf">
      <v-row v-for="shelf in userShelves" :key="shelf.id" class="pa-4">
        <v-col sm="12" class="d-flex teal white--text justify-center">
          <!-- Button to create new shelf -->
          <v-btn text @click="needCreateShelf = true">
            <v-icon left darken>mdi-plus-circle</v-icon>
          </v-btn>
          <h3>{{ shelf.name }}</h3>
          <!-- Button to delete shelf -->
          <v-btn text @click="deleteShelf(shelf.id)">
            <v-icon right darken>mdi-delete</v-icon>
          </v-btn>
        </v-col>
        
        <v-col sm="12">
          <!-- show shelfbook detail -->
          <v-row class="pa-4">
            <!-- Button to browse All-Books if user has no shelfbook -->
            <v-col sm="12" class="d-flex justify-center mt-4" v-if="userShelfbooks.length < 1">
              <v-btn elevation="10" @click="goToAllBooks">
                Add books to your shelf?<v-icon
                  >mdi-arrow-right-bold-circle</v-icon
                >
              </v-btn>
            </v-col>
            <!-- Shelfbook card column -->
            <div
              v-for="shelfbook in userShelfbooks"
              :key="shelfbook.id"
            >
              <v-col v-if="shelfbook.shelf.id === shelf.id" sm="12" lg="4">
                <v-card class="shelfbookCard" elevation="10">
                  <v-card-title class="black white--text">{{ shelfbook.book.title }}</v-card-title>
                  <v-card-subtitle>{{ shelfbook.book.author }}</v-card-subtitle>
                  <v-img
                    width="100%"
                    max-height="300"
                    :contain="true"
                    :src="
                      shelfbook.book.cover
                        ? shelfbook.book.cover
                        : 'https://picsum.photos/200/300'
                    "
                  />
                  <v-divider />
                  <v-card-text class="status grey lighten-2">
                    <v-icon
                      v-if="shelfbook.status === 'wish'"
                      color="yellow lighten-1"
                      >mdi-bookmark-multiple</v-icon
                    >
                    <v-icon
                      v-if="shelfbook.status === 'reading'"
                      color="light-green darken-1"
                      >mdi-book-open-variant</v-icon
                    >
                    <v-icon
                      v-if="shelfbook.status === 'read'"
                      color="light-blue darken-1"
                      >mdi-book-check</v-icon
                    >
                    {{ shelfbook.status }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      class="blue-grey darken-1 white--text"
                      @click="
                        $router.push({
                          name: 'book-detail',
                          params: { id: shelfbook.book.id },
                        })
                      "
                      >Book Detail</v-btn
                    >
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn
                      block
                      class="amber white--text"
                      @click="toggleSnackbar(shelfbook.id)"
                      >Change Status</v-btn
                    >
                  </v-card-actions>
                </v-card>
                <v-snackbar v-model="snackbarStatus[shelfbook.id]" :centered="true" :timeout="-1">
                  <v-row>
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
                        color="yellow darken-2"
                        @click="updateStatus(shelfbook.id)"
                        >Confirm</v-btn
                      >
                    </v-col>
                    <v-col sm="12">
                      <v-btn
                        block
                        color="grey"
                        @click="toggleSnackbar(shelfbook.id)"
                        >Cancel</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-snackbar>
              </v-col>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <!-- Create shelf form -->
    <div v-else>
      <v-row>
        <v-col sm="12" class="d-flex justify-center teal white--text pa-4">
          <h2>Create a shelf</h2>
        </v-col>
        <v-col sm="12" lg="4" offset-lg="4">
          <v-card color="grey lighten-4 pa-4 mt-4" elevation="10">
            <v-card-title>Name your new shelf</v-card-title>
            <v-form @submit.prevent="createNewShelf">
              <v-card-text>
                <v-text-field
                  v-model="newShelfName"
                  label="Shelf name"
                  :counter="20"
                  type="text"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn block class="blue-grey darken-4 white--text" type="submit"
                  >Create</v-btn
                >
              </v-card-actions>
              <v-card-actions>
                <v-btn block class="blue-grey lighten-4 mt-2" @click="(userShelves.length > 0) ? (needCreateShelf = false) : clearForm"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';
import router from '@/router';

@Component({
  name: 'Shelfbook',
})
export default class extends Vue {
  shelves: Shelf[] = [];
  shelfbooks: Shelfbook[] = [];
  status: string[] = ['wish', 'reading', 'read'];
  selected: string = '';
  snackbar: {} = {};
  error: string = '';
  newShelfName: string = '';
  needCreateShelf: boolean = true;

  async getUserShelves() {
    try {
      let { data } = await Shelf.where({ user: this.currentUser?.id }).all();
      if (data) {
        this.shelves = data;
        this.needCreateShelf = false;
        for await (let shelf of this.shelves) {
          await this.getUserShelfbooks(shelf.id);
        }
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getUserShelfbooks(shelfId: string) {
    try {
      let { data } = await Shelfbook.includes('book')
        .where({
          shelf__user: this.currentUser?.id,
        })
        .all();
      if (data) this.shelfbooks = data;
      this.shelfbooks.forEach(sb => {
        this.snackbar[sb.id] = false;
      })
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async updateStatus(id: string) {
    try {
      let { data } = await Shelfbook.find(id);
      data.status = this.selected;
      await data.save();
      await this.getUserShelves();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.toggleSnackbar(id);
    }
  }

  async createNewShelf() {
    try {
      await Shelf.newShelf(this.newShelfName, this.currentUser);
      await this.getUserShelves();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async deleteShelf(id: string) {
    try {
      await Shelf.delShelf(id);
      await this.getUserShelves();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  clearForm() {
    document.querySelectorAll('input').forEach((i) => {
      i.value = '';
    });
  }

  goToAllBooks() {
    this.$router.push({ name: 'all-books' });
  }

  toggleSnackbar(id: string) {
    if (!this.snackbar[id]) {
      console.log(this.snackbar)
      let shelfbook = this.shelfbooks.filter((sb) => sb.id === id);
      this.selected = shelfbook.length > 0 ? shelfbook[0].status : '';
    }
    this.snackbar[id] = !this.snackbar[id];
  }

  get snackbarStatus() {
    return this.snackbar;
  }

  get doNeedCreateShelf() {    
    return this.needCreateShelf;
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
.shelfbookCard {
  height: 600px !important;
}
.status {
  font-size: 1rem;
  padding: 20px !important;
  margin-top: 10px;
}
</style>
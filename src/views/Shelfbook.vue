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

        <!-- Button to browse All-Books if user has no shelfbook -->
        <v-col
          sm="12"
          class="d-flex justify-center mt-4"
          v-if="userShelfbooks.length < 1"
        >
          <v-btn elevation="10" @click="goToAllBooks">
            Add books to your shelf?<v-icon>mdi-arrow-right-bold-circle</v-icon>
          </v-btn>
        </v-col>

        <!-- Shelfbook column -->
        <v-col
          v-for="shelfbook in shelfbooksOfShelf[shelf.id]"
          :key="shelfbook.id"
          sm="12"
          lg="4"
        >
          <!-- Shelfbook card -->
          <v-card class="shelfbookCard" elevation="10">
            <v-card-title class="black white--text">{{
              shelfbook.book.title
            }}</v-card-title>
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
            <v-card-text class="status grey lighten-4">
              <v-icon v-if="shelfbook.status === 'wish'" color="amber"
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
                class="orange darken-1 white--text"
                @click="toggleSnackbar(shelfbook.id)"
                >Change Status</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <shelfbook-snack
        :snackbarStatus="snackbarStatus"
        :shelfbook="shelfbookToLoad"
        :status="status"
        @toggleSnackbar="toggleSnackbar($event)"
        @updateStatus="updateStatus($event)"
      />
    </div>

    <!-- Create shelf form -->
    <div v-else>
      <add-shelf-form
        @shelfAdded="getUserShelves"
        :shelves="shelves"
        :needCreateShelf="needCreateShelf"
        @cancelAddShelf="toggleCreateShelf"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { User, Shelf, Shelfbook } from '@/api';
import { authModule } from '@/store';
import ShelfbookSnack from '@/components/ShelfbookSnack.vue';
import AddShelfForm from '@/components/AddShelfForm.vue';

@Component({
  name: 'Shelfbook',
  components: {
    AddShelfForm,
    ShelfbookSnack,
  },
})
export default class extends Vue {
  shelves: Shelf[] = [];
  shelfbooks: Shelfbook[] = [];
  shelfbooksOfShelf: {} = {};
  status: string[] = ['wish', 'reading', 'read'];
  snackbar: boolean = false;
  error: string = '';
  needCreateShelf: boolean = true;
  selectedShelfbook: Shelfbook | null = null;

  async getUserShelves() {
    try {
      let { data } = await Shelf.where({ user: this.currentUser?.id }).all();
      if (data && data.length > 0) {
        this.shelves = data;
        this.needCreateShelf = false;
        for await (let shelf of this.shelves) {
          await this.getUserShelfbooks(shelf.id);
        }
      } else {
        this.needCreateShelf = true;
      }
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getUserShelfbooks(shelfId: string) {
    try {
      // get all shelvebooks of user
      let { data } = await Shelfbook.includes('book')
        .where({
          shelf__user: this.currentUser?.id,
        })
        .all();
      if (data) this.shelfbooks = data;

      // Populate shelfbooksOfShelf
      this.shelves.forEach((s) => {
        this.shelfbooksOfShelf[s.id] = [];
        this.shelfbooks.map((sb) => {
          if (sb.shelf.id === s.id) this.shelfbooksOfShelf[s.id].push(sb);
        });
      });
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async updateStatus(event: []) {
    try {
      let { data } = await Shelfbook.find(event[0]);
      data.status = event[1];
      await data.save();
      await this.getUserShelves();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.toggleSnackbar();
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

  goToAllBooks() {
    this.$router.push({ name: 'all-books' });
  }

  toggleSnackbar(id: string) {
    this.selectedShelfbook = this.shelfbooks.filter((sb) => sb.id === id)[0];
    this.snackbar = !this.snackbar;
  }

  toggleCreateShelf() {
    this.needCreateShelf = !this.needCreateShelf;
  }

  get shelfbookToLoad() {
    return this.selectedShelfbook;
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
.img-container {
  height: 300px;
  padding: 0%;
  margin: 0%;
  display: flex;
  align-content: center;
}
</style>
<template>
  <div class="blue-grey lighten-4 main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-row v-for="shelf in userShelves" :key="shelf.id" class="shelfRow">
      <v-col sm="12">
        <v-card class="shelfCard teal white--text">
          <v-card-title>{{ shelf.name }}</v-card-title>
        </v-card>
      </v-col>      
      
      <!-- show shelfbook detail -->
      <v-col sm="12" class="shelfbookRow">
        <v-row>
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
                <v-btn block class="amber white--text" @click="toggleSnackbar(shelfbook.id)">Change Status</v-btn>
              </v-card-actions>    
            </v-card>
            <v-snackbar v-model="snackbar" :centered="true" :timeout="-1">
              <v-row>
                <v-col sm="12">
                  <h3>{{shelfbook.book.title}}</h3>
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
                  <v-btn block color="yellow darken-2" @click="updateStatus(shelfbook.id)">Confirm</v-btn>
                </v-col>
                <v-col sm="12">
                  <v-btn block color="grey" @click="toggleSnackbar(shelfbook.id)">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-snackbar>
          </v-col>
        </v-row>
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
  status: string[] = ['wish', 'reading', 'read'];
  selected: string = '';
  snackbar: boolean = false;
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

  async updateStatus(id: string) {
    try {
      let {data} = await Shelfbook.find(id);
      data.status = this.selected;
      await data.save();      
      await this.getUserShelves();
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    } finally {
      this.toggleSnackbar(id)
    }
  }

  toggleSnackbar(id: string) {
    if(!this.snackbar) {
      let shelfbook = this.shelfbooks.filter(sb => sb.id === id);
      this.selected = (shelfbook.length > 0 ) ? shelfbook[0].status : '';
    }
    this.snackbar = !this.snackbar
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
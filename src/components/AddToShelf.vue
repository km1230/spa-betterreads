<template>
  <!-- Book detail -->
  <div class="addToShelfCard">
    <v-card elevation="2" class="cardContent blue-grey lighten-5">
      <v-card-title v-if="!userHasBook">Add to Book Shelf</v-card-title>
      <v-card-title v-else>Remove from shelf?</v-card-title>
      <v-card-subtitle>
        <h3>Which shelf? (Uncheck to remove)</h3>
      </v-card-subtitle>
      <v-card-text v-if="retrieveShelves">
        <v-checkbox
          v-for="shelf in retrieveShelves"
          :key="shelf.id"
          :label="shelf.name"
          :value="shelf.id"
          v-model="selected"
          :ref="'checkbox'+shelf.id"
        ></v-checkbox>
      </v-card-text>
      <v-card-text v-else>
        Seems you don't have any shelf<br />
        Create one? <br />
        <v-text-field v-model="newShelfName" label="New Shelf Name" clearable />
      </v-card-text>
      <v-card-actions v-if="retrieveShelves && !userHasBook">
        <v-btn block class="blue white--text" @click="chooseShelf"
          >Add</v-btn
        >
      </v-card-actions>
      <v-card-actions v-else-if="retrieveShelves && userHasBook">
        <v-btn block class="blue white--text" @click="removeShelfBook"
          >Update</v-btn
        >
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn block class="blue white--text" @click="createShelf"
          >Create</v-btn
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
import { Shelf, Shelfbook, User } from '@/api';

@Component({name: 'AddToShelf'})
export default class extends Vue {
  @Prop() readonly currentUser: User | any;
  @Prop() readonly userHasBook: boolean;
  userShelves: Shelf[] | null = null;
  selected: string[] = [];
  newShelfName: string = '';
  chosenShelves: Shelf[] = [];
  shelfbooks: Shelfbook[] = [];
  error: string = '';  

  async chooseShelf() {    
    for await (let id of this.selected) {
      this.getChosenShelves(id);
    }
    this.$emit('shelfChosen', this.chosenShelves);
  }

  async getChosenShelves(id: string) {
    try {
      let {data} = await Shelf.find(id);
      this.chosenShelves.push(data)
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  createShelf() {
    this.$emit('createShelf', this.newShelfName);
  }

  clearSelection() {
    this.selected = [];
    this.$emit('cancel');
  }

  removeShelfBook() {
    // TO-DO
    // compare this.shelvebooks - this.selected
    // get differences from this.shelvebooks
    // emit event and delete those shelvebooks instances
  }

  async getUserShelves() {
    try {
      let {data} = await Shelf.where({user: this.currentUser.id}).all()
      this.userShelves = data
      this.getShelfbooks(); 
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  async getShelfbooks () {
    try {            
      // get the shelfbooks instances
      if(this.userShelves)
        for (let shelf of this.userShelves) {        
          let {data} = await Shelfbook.where({shelf: shelf.id, book: this.$route.params.id}).first()
          if(data) this.shelfbooks.push(data) 
        }
      // update checkbox v-model & tick the boxes accordingly
      if(this.shelfbooks.length > 0) this.shelfbooks.forEach(sb => {
        this.selected.push(sb.shelf.id);        
      })
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  get retrieveShelves() {
    return this.userShelves
  }

  mounted() {
    this.getUserShelves();        
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

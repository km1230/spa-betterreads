<template>
  <div class="list-view" :key="$route.name">
    <abstract-table
      ref="table"
      :headers="headers"
      :scopeFactory="scopeFactory"
      :singleSelect="singleSelect"
      @list-select-change="listSelectChange"
    ></abstract-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AbstractTable from '@/components/admin/AbstractTable.vue';
import {
  ApplicationRecord,
  User,
  Book,
  Category,
  Shelf,
  Shelfbook,
} from '@/api';

@Component({
  components: {
    AbstractTable,
  },
})
export default class extends Vue {
  singleSelect = true;

  get model() {
    switch (this.$route.name) {
      case 'admin-users':
        return User;
      // case 'admin-some-model':
      //   return SomeModel;

      case 'admin-books':
        return Book;

      case 'admin-categories':
        return Category;

      case 'admin-shelves':
        return Shelf;

      case 'admin-shelfbooks':
        return Shelfbook;

      default:
        return ApplicationRecord;
    }
  }

  get headers() {
    return this.model.listHeaders();
  }

  get scopeFactory() {
    return this.model.scopeFactory;
  }

  update() {
    (this.$refs.table as AbstractTable).update();
  }

  listSelectChange(selected: ApplicationRecord[]) {
    this.$emit('list-select-change', selected);
  }
}
</script>

<template>
  <div class="list-view" :key="$route.name">
    <abstract-table
      :headers="headers"
      :scopeFactory="scopeFactory"
      :singleSelect="singleSelect"
      @list-select-change="listSelectChange"
    ></abstract-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AbstractTable from '@/components/admin/AbstractTable.vue';
import { ApplicationRecord, User } from '@/api';

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

  listSelectChange(selected: ApplicationRecord[]) {
    this.$emit('list-select-change', selected);
  }
}
</script>

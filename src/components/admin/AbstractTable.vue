<template>
  <div class="list-view">
    <v-data-table
      :headers="headers"
      :loading="loading"
      :server-items-length="total"
      :options.sync="options"
      :items="items"
      :show-select="true"
      :single-select="singleSelect"
      v-model="selected"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator';
import { Scope } from 'spraypaint';
import { ApplicationRecord } from '@/api';

@Component({
  components: {},
})
export default class extends Vue {
  // eg [{ value: 'id', text: 'ID' }]
  @Prop({ required: true }) readonly headers: any[];

  @Prop({ required: true }) readonly singleSelect: boolean;

  // eg () => User.includes(['someFields']).where({ project: 1 });
  @Prop({ required: true }) readonly scopeFactory: () => Scope<
    ApplicationRecord
  >;

  selected: ApplicationRecord[] = [];

  loading: boolean = false;

  total: number = 0;

  items: ApplicationRecord[] = [];

  options = {
    sortBy: [],
    sortDesc: [],
    page: 1,
    itemsPerPage: 10,
  };

  async update() {
    this.loading = true;
    try {
      // initial scope + page + pageSize
      let scope = this.scopeFactory()
        .page(this.options.page)
        .per(this.options.itemsPerPage);

      // order by
      this.options.sortBy.forEach((sort, i) => {
        const order: any = {};
        order[sort] = this.options.sortDesc[i] ? 'desc' : 'asc';
        scope = scope.order(order);
      });

      // // handle where clause ?!

      // get result
      const result = await scope.all();
      this.items = result.data;
      this.total = result.meta.pagination.count;
    } catch (e) {
      this.items = [];
    } finally {
      this.loading = false;
    }
  }

  @Watch('selected', { immediate: true })
  selectedChange() {
    this.$emit('list-select-change', this.selected);
  }

  @Watch('options', { deep: true, immediate: true })
  optionsChanged() {
    this.update();
  }
}
</script>

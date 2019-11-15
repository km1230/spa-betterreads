<template>
  <div class="admin">
    <div class="admin-nav-bar">
      <v-list nav>
        <v-subheader>ADMIN</v-subheader>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item dense v-for="(item, i) in items" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="admin-content">
      <v-list color="transparent">
        <v-subheader>{{ routeTitle }}</v-subheader>
      </v-list>
      <router-view @list-select-change="listSelectChange"></router-view>
    </div>
    <div class="admin-action-bar">
      <v-list color="transparent">
        <v-subheader>TASKS</v-subheader>
        <v-list-item
          v-for="(item, i) in actions"
          :key="i"
          @click="item.onClick"
        >
          <v-list-item-avatar color="primary">
            <v-icon v-text="item.icon" color="white"></v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AdminListView from '@/components/admin/AdminListView.vue';
import { ApplicationRecord } from '@/api';

@Component({
  components: {},
})
export default class extends Vue {
  item = 0;

  items = [
    { text: 'Users', icon: 'mdi-account', to: { name: 'admin-users' } },
    {
      text: 'My Accout',
      icon: 'mdi-account',
      to: { name: 'admin-my-account' },
    },
  ];

  actions = [
    {
      text: 'Do Something',
      icon: 'mdi-plus',
      onClick: () => {
        // do something
      },
    },
  ];

  get routeTitle() {
    return this.$route.meta.title.toUpperCase();
  }

  listSelectChange(selected: ApplicationRecord[]) {
    // selection changed
  }
}
</script>

<style lang="scss">
.admin {
  position: relative;
  display: flex;
  align-items: stretch;
  border-top: 1px solid #eee;
  min-height: 80vh;

  .admin-nav-bar {
    min-width: 300px;
    border-right: 1px solid #eee;
    background-color: white;
  }
  .admin-content {
    flex-grow: 1;
    background-color: white;
  }
  .admin-action-bar {
    min-width: 300px;
    border-left: 1px solid #eee;
  }
}
</style>

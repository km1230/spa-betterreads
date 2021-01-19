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
      <router-view
        ref="router"
        @list-select-change="listSelectChange"
      ></router-view>
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
          <v-list-item-content v-text="item.content"></v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AdminListView from '@/components/admin/AdminListView.vue';
import { ApplicationRecord, User } from '@/api';
import { Mutation } from 'vuex-module-decorators';

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
    { text: 'Categories', icon: '', to: { name: 'admin-categories' } },
    { text: 'Books', icon: '', to: { name: 'admin-books' } },
    { text: 'Shelves', icon: '', to: { name: 'admin-shelves' } },
    { text: 'Shelfbooks', icon: '', to: { name: 'admin-shelfbooks' } },
  ];

  error: '';

  actions = [
    {
      text: 'Do something',
      icon: 'mdi-plus',
      onClick: () => {},
      content: '',
    },
  ];

  get routeTitle() {
    return this.$route.meta.title.toUpperCase();
  }

  listSelectChange(selected: ApplicationRecord[]) {
    if (selected.length != 0) {
      switch (this.routeTitle) {
        case 'USERS': {
          this.actions = [
            {
              text: 'Is staff?',
              icon: 'mdi-account-key',
              onClick: async () => {
                try {
                  let { data } = await User.find(selected[0].id);
                  if (data != null) {
                    let user = data;
                    user.isStaff = !user.isStaff;
                    await user.save();
                    (this.$refs.router as AdminListView).update();
                  }
                } catch (e) {
                  this.error = e.response
                    ? e.response.errors[0].detail
                    : 'Unknown error';
                }
              },
              content: '',
            },
          ];
          break;
        }
      }
    }
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

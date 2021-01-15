<template>
  <header id="page-header">
    <a href="/"
      ><img id="page-header-logo" src="@/assets/logo.png" alt="Base"
    /></a>
    <div class="right">
      <nav id="page-header-menu">
        <ul>
          <li v-for="(item, i) in filteredMenu" :key="i">
            <router-link :to="item.to">{{ item.title }}</router-link>
          </li>
          <li v-if="isLoggedIn">
            <a @click.prevent="logout">Logout</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { authModule } from '@/store';

@Component({
  components: {},
})
export default class extends Vue {
  menu = [
    {
      title: 'Home',
      to: {
        name: 'home',
      },
      show: () => true,
    },
    {
      title: 'Explore',
      to: {
        name: 'home',
      },
      show: () => false,
    },
    {
      title: 'Account',
      to: {
        name: 'account',
      },
      show: () => this.isLoggedIn,
    },
    {
      title: 'Admin',
      to: {
        name: 'admin',
      },
      show: () => this.isStaff,
    },
  ];

  search: string = '';

  searchFocused: boolean = false;

  get filteredMenu() {
    return this.menu.filter((item) => item.show());
  }

  get isLoggedIn() {
    return authModule.isLoggedIn;
  }

  get isStaff() {
    return authModule.isStaff;
  }

  get searchOpen() {
    return this.searchFocused && !!this.search;
  }

  logout() {
    authModule.logout();
  }
}
</script>

<style lang="scss">
#page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 3rem;
  background-color: white;

  #page-header-logo {
    width: 120px;
  }

  .right {
    text-align: right;
  }

  .search-box {
    width: 300px;
    transition: width 0.3s;
  }

  .search-container {
    margin-top: 1rem;
    padding: 0.5rem 0;
    transition: all 0.3s;

    &.search-open {
      padding: 0.5rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

      .search-box {
        width: 500px;

        .v-input__slot {
          background: rgba(0, 0, 0, 0);
          padding: 0;
        }
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: inline-block;
    padding: 0;
    margin: 0;
  }

  li + li {
    margin-left: 1rem;
  }
}
</style>

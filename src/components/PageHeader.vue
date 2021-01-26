<template>
 
    


    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a href="/">
          <img id="page-header-logo" src="@/assets/library.png" alt="Base"/>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li v-for="(item, i) in filteredMenu" :key="i" class="nav-item">
              <router-link :to="item.to" class="nav-link">{{ item.title }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>





  
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
      title: 'All Books',
      to: {
        name: 'all-books',
      },
      show: () => true,
    },
    {
      title: 'My Shelf-Books',
      to: {
        name: 'user-shelfbooks',
      },
      show: () => this.isLoggedIn,
    },
    {
      title: 'Add Book',
      to: {
        name: 'add-book',
      },
      show: () => this.isStaff,
    },
    {
      title: 'Admin',
      to: {
        name: 'admin',
      },
      show: () => this.isStaff,
    },
    {
      title: 'Login',
      to: {
        name: 'login',
      },
      show: () => !this.isLoggedIn,
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
  padding: 20px;
  background-color: white;
  max-height: 15vh;

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

#page-header-logo {
  max-width: 100px;
}
</style>

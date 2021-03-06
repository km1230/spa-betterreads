import AdminListView from '@/components/admin/AdminListView.vue';
import MyAccountView from '@/components/admin/MyAccount.vue';
import { authModule } from '@/store';
import AddBook from '@/views/AddBook.vue';
import Admin from '@/views/Admin.vue';
import AllBooks from '@/views/AllBooks.vue';
import BookDetail from '@/views/BookDetail.vue';
import EditBook from '@/views/EditBook.vue';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';
import PasswordReset from '@/views/PasswordReset.vue';
import PermissionDenied from '@/views/PermissionDenied.vue';
import Registration from '@/views/Registration.vue';
import Shelfbook from '@/views/Shelfbook.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/all-books',
    name: 'all-books',
    component: AllBooks,
    meta: {
      title: 'All Books'
    },
  },
  {
    path: '/add-book',
    name: 'add-book',
    component: AddBook,
    meta: {
      title: 'Add New Book',
    },
  },
  {
    path: '/edit-book/:id',
    name: 'edit-book',
    component: EditBook,
    meta: {
      title: 'Edit Book',
    },
  },
  {
    path: '/book-detail/:id',
    name: 'book-detail',
    component: BookDetail,
    meta: {
      title: 'Book Detail',
    },
  },
  {
    path: '/user-shelfbooks',
    name: 'user-shelfbooks',
    component: Shelfbook,
    meta: {
      title: 'My Shelf-Books',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration,
    meta: {
      title: 'Registration',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: PasswordReset,
    meta: {
      title: 'Forgotten your password',
    },
  },
  {
    path: '/set-password',
    name: 'set-password',
    component: PasswordReset,
    meta: {
      title: 'Set your password',
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      roles: ['admin'],
      title: 'Admin',
    },
    children: [
      {
        path: 'my-account',
        name: 'admin-my-account',
        component: MyAccountView,
        meta: {
          title: 'My Account',
        },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: AdminListView,
        meta: { title: 'Users' },
      },
      {
        path: 'books',
        name: 'admin-books',
        component: AdminListView,
        meta: {
          title: 'Books',
        },
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: AdminListView,
        meta: {
          title: 'Categories',
        },
      },
      {
        path: 'shelves',
        name: 'admin-shelves',
        component: AdminListView,
        meta: {
          title: 'Shelves',
        },
      },
      {
        path: 'shelfbooks',
        name: 'admin-shelfbooks',
        component: AdminListView,
        meta: {
          title: 'Shelf-books',
        },
      },
      // more here
      // { path: 'some-model', name: 'admin-some-model', component: AdminListView },
    ],
  },
  {
    path: '/permission-denied',
    name: 'denied',
    component: PermissionDenied,
    meta: {
      title: 'Permission denied',
    },
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Not found',
    },
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

// could potentially move this to App.vuee

router.beforeEach(async (to, from, next) => {
  // get the SPA ready by checking if logged in etc
  if (!authModule.ready) {
    await authModule.init();
  }
  // check permissions on route
  if (to.meta && to.meta.roles && !authModule.canAccess(to.meta.roles)) {
    next({ name: 'denied' });
  }
  next();
});

export default router;

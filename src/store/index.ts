import AuthModule from '@/store/Auth';
import SnackModule from '@/store/Snack';
import Vue from 'vue';
import Vuex from 'vuex';
import { getModule } from 'vuex-module-decorators';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    AuthModule,
    SnackModule,
    // BookModule,
  },
});

export const authModule = getModule(AuthModule, store);
export const snackModule = getModule(SnackModule, store);
// export const bookModule = getModule(BookModule, store);

// authModule.addLoginHook(myModule.myLoginHook);
// authModule.addLogoutHook(myModule.myLogoutHook);

export default store;

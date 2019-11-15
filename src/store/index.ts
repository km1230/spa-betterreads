import Vue from 'vue';
import Vuex from 'vuex';
import { getModule } from 'vuex-module-decorators';
import Auth from '@/store/Auth';
import Snack from '@/store/Snack';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Auth,
    Snack,
  },
});

export const authModule = getModule(Auth, store);
export const snackModule = getModule(Snack, store);
export default store;

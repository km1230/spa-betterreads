import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
} from 'vuex-module-decorators';

@Module({
  name: 'SnackModule',
  namespaced: true,
})
export default class SnackModule extends VuexModule {
  snacks: string[] = [];

  get snacksVisible() {
    return this.snacks.length > 0;
  }

  @Mutation
  showSnackbar(text: string) {
    this.snacks.push(text);
    window.setTimeout(() => {
      this.snacks.splice(0, 1);
    }, 2000);
  }
}

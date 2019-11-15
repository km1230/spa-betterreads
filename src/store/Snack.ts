import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
} from 'vuex-module-decorators';

@Module({
  name: 'Snack',
  namespaced: true,
})
export default class Snack extends VuexModule {
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

import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
} from 'vuex-module-decorators';
import { User, Session } from '@/api';

@Module({
  name: 'Auth',
  namespaced: true,
})
export default class Auth extends VuexModule {
  ready: boolean = false;

  user: User | null = null;

  session: Session | null = null;

  get isLoggedIn(): boolean {
    return !!this.ready && !!this.user && !!this.session;
  }

  get canAccess() {
    return (roles: string[]): boolean => true;
  }

  @Mutation
  setReady() {
    this.ready = true;
  }

  @Mutation
  setUser(user: User | null) {
    this.user = user;
  }

  @Mutation
  setSession(session: Session | null) {
    this.session = session;
  }

  @Action({ rawError: true })
  async login({ email, password }: { email: string; password: string }) {
    try {
      const session = new Session({ email, password });
      await session.save();
      localStorage.setItem('jwt', session.token);

      if (session && session.user.id) {
        const user = (await User.find(session.user.id)).data;
        this.setSession(session);
        this.setUser(user);
      }
    } catch (e) {
      localStorage.removeItem('jwt');
      this.setSession(null);
      this.setUser(null);
      throw e;
    }
  }

  @Action({ rawError: true })
  async getCurrentUser() {
    try {
      const session = (await Session.first()).data;

      if (session && session.user.id) {
        const user = (await User.find(session.user.id)).data;
        this.setSession(session);
        this.setUser(user);
      }
    } catch (e) {
      localStorage.removeItem('jwt');
      this.setSession(null);
      this.setUser(null);
      throw e;
    }
  }

  @Action
  async init() {
    try {
      if (localStorage.getItem('jwt')) {
        await this.getCurrentUser();
      }
    } catch {
      // no comment
    } finally {
      this.setReady();
    }
  }

  @Action
  async logout() {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  }
}

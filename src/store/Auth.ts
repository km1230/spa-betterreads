import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { User, Session, ApplicationRecord } from '@/api';

@Module({
  name: 'AuthModule',
  namespaced: true,
})
export default class AuthModule extends VuexModule {
  ready = false;

  user: User | null = null;

  session: Session | null = null;

  loginHooks: Array<
    (loginData: { user: User; session: Session }) => Promise<void>
  > = [];

  logoutHooks: Array<() => Promise<void>> = [];

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
  addLoginHook(
    hook: (loginData: { user: User; session: Session }) => Promise<void>,
  ) {
    this.loginHooks.push(hook);
  }

  @Mutation
  addLogoutHook(hook: () => Promise<void>) {
    this.logoutHooks.push(hook);
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

      if (session && session.id && session.user.id) {
        ApplicationRecord.jwt = session.token;
        const user = (await User.find(session.user.id)).data;
        this.setSession(session);
        this.setUser(user);
        await this.onLogin();
      }
    } catch (e) {
      this.setSession(null);
      this.setUser(null);
      throw e;
    }
  }

  @Action({ rawError: true })
  async getCurrentUser() {
    try {
      const session = (await Session.first()).data;

      if (session && session.id && session.user.id) {
        const user = (await User.find(session.user.id)).data;
        this.setSession(session);
        this.setUser(user);
        await this.onLogin();
      }
    } catch (e) {
      this.setSession(null);
      this.setUser(null);
      throw e;
    }
  }

  @Action({ rawError: true })
  async onLogin() {
    const { user, session } = this;
    if (!user || !session) {
      throw new Error('user and session not set');
    }
    // call all other modules that need login data
    await Promise.all(this.loginHooks.map(hook => hook({ user, session })));
  }

  @Action({ rawError: true })
  async onLogout() {
    // call all other modules that need login data
    await Promise.all(this.logoutHooks.map(hook => hook()));
  }

  @Action({ rawError: true })
  async logout() {
    const session = new Session();
    try {
      await session.destroy();
    } finally {
      await this.onLogout();
      ApplicationRecord.jwt = undefined;
      window.location.href = '/';
    }
  }

  @Action({ rawError: true })
  async init() {
    try {
      await this.getCurrentUser();
      // logged in
    } catch {
      // not logged in
    } finally {
      // add redirect on 401 middleware
      ApplicationRecord.middlewareStack.afterFilters.push(response => {
        if (response.status === 401) {
          ApplicationRecord.jwt = undefined;
          const next = encodeURIComponent(window.location.pathname);
          window.location.href = `/login?next=${next}`;
        }
      });

      // set ready
      this.setReady();
    }
  }
}

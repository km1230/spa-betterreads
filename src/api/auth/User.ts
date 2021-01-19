import { Attr, Model } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class User extends ApplicationRecord {
  static jsonapiType = 'users';

  static async register(email: string, password: string) {
    const user = new User({ email, password });
    await user.save();
    return user;
  }

  static listHeaders() {
    return [
      {
        text: 'ID',
        value: 'id',
        width: 100,
      },
      {
        text: 'Email address',
        value: 'email',
      },
      {
        text: 'Staff',
        value: 'isStaff',
      },
    ];
  }

  static scopeFactory() {
    return User.includes([]);
  }

  @Attr() email: string;
  @Attr() isStaff: boolean;

  // write only
  @Attr() password: string;

  @Attr() currentPassword: string;

  // not used - fix me!
  changePassword(currentPassword: string, newPassword: string) {
    const user = new User({ id: this.id });
    user.isPersisted = true;
    user.password = newPassword;
    user.currentPassword = currentPassword;
    return user.save();
  }
}

import { Model, Attr, HasOne } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class PasswordResetConfirmation extends ApplicationRecord {
  static jsonapiType = 'password-reset-confirmations';

  static setPassword(
    uid: string,
    token: string,
    newPassword1: string,
    newPassword2: string,
  ) {
    const passConfirm = new PasswordResetConfirmation({
      uid,
      token,
      newPassword1,
      newPassword2,
    });
    return passConfirm.save();
  }

  @Attr() uid: string;

  @Attr() token: string;

  @Attr() newPassword1: string;

  @Attr() newPassword2: string;
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class CreditGuardService implements CanActivate {

  constructor(
      private router: Router,
      private user: UserService
  ) { }

  /**
   * 認証
   * @method canActivate
   */
  public async canActivate() {
      if (this.user.data.creditCards === undefined
      || this.user.data.creditCards.length === 0) {
          this.router.navigate(['//register/credit']);

          return false;
      }

      return true;
  }

}

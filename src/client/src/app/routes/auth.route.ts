import { AuthLogoutComponent } from '../components/pages/auth/auth-logout/auth-logout.component';
import { AuthSelectComponent } from '../components/pages/auth/auth-select/auth-select.component';
import { AuthSigninComponent } from '../components/pages/auth/auth-signin/auth-signin.component';
import { AuthSignoutComponent } from '../components/pages/auth/auth-signout/auth-signout.component';
import { BaseComponent } from '../components/pages/base/base.component';
import { FidoGuardService } from '../services/fido-guard/fido-guard.service';

/**
 * 認証ルーティング
 */
export const route = {
    path: 'auth',
    canActivate: [FidoGuardService],
    children: [
        { path: 'select', component: AuthSelectComponent },
        { path: 'signin', component: AuthSigninComponent },
        { path: 'signout', component: AuthSignoutComponent }
    ]
};

/**
 * ログアウトルーティング
 */
export const logoutRoute = {
    path: 'auth',
    component: BaseComponent,
    children: [
        { path: 'logout', component: AuthLogoutComponent }
    ]
};

import { RegisterCreditComponent } from '../components/pages/register/register-credit/register-credit.component';
import { RegisterComponent } from '../components/pages/register/register-index/register-index.component';
import {
    RegisterProgramMembershipComponent
} from '../components/pages/register/register-program-membership/register-program-membership.component';
import { RegisterTermsComponent } from '../components/pages/register/register-terms/register-terms.component';
import { MemberGuardService } from '../services/member-guard/member-guard.service';

/**
 * 認証ルーティング
 */
export const route = {
    path: 'register',
    children: [
        { path: '', component: RegisterComponent },
        { path: 'terms', component: RegisterTermsComponent },
        { path: 'credit', canActivate: [MemberGuardService], component: RegisterCreditComponent },
        { path: 'membership', canActivate: [MemberGuardService], component: RegisterProgramMembershipComponent }
    ]
};

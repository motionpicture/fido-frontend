import { AboutComponent } from '../components/pages/about/about.component';
import { BaseComponent } from '../components/pages/base/base.component';
import { BenefitsComponent } from '../components/pages/benefits/benefits.component';
import { LawComponent } from '../components/pages/law/law.component';
import { PolicyComponent } from '../components/pages/policy/policy.component';
import { PrivacyComponent } from '../components/pages/privacy/privacy.component';
import { TicketComponent } from '../components/pages/ticket/ticket.component';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { FidoGuardService } from '../services/fido-guard/fido-guard.service';

/**
 * 共通ルーティング
 */
export const route = {
    path: '',
    component: BaseComponent,
    canActivate: [FidoGuardService, AuthGuardService],
    children: [
        { path: 'ticket', component: TicketComponent },
        { path: 'about', component: AboutComponent },
        { path: 'policy', component: PolicyComponent },
        { path: 'law', component: LawComponent },
        { path: 'privacy', component: PrivacyComponent },
        { path: 'benefits', component: BenefitsComponent }
    ]
};


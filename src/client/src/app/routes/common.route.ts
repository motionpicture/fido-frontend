import { BaseComponent } from '../components/pages/base/base.component';
import { QrcodeComponent } from '../components/pages/qrcode/qrcode.component';
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
        { path: 'qrcode', component: QrcodeComponent }
    ]
};


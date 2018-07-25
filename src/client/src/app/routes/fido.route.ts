import { FidoRegisterComponent } from '../components/pages/fido/fido-register/fido-register.component';
import { FidoRemoveComponent } from '../components/pages/fido/fido-remove/fido-remove.component';

/**
 * 生体認証ルーティング
 */
export const route = {
    path: 'fido',
    children: [
        { path: 'register', component: FidoRegisterComponent },
        { path: 'remove', component: FidoRemoveComponent }
    ]
};

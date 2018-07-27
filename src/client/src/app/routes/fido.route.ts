import { BaseComponent } from '../components/pages/base/base.component';
import { FidoRegisterComponent } from '../components/pages/fido/fido-register/fido-register.component';
import { FidoRemoveComponent } from '../components/pages/fido/fido-remove/fido-remove.component';

/**
 * 生体認証ルーティング
 */
export const route = {
    path: 'fido',
    children: [
        { path: 'register', component: FidoRegisterComponent },
        {
            path: '',
            component: BaseComponent,
            children: [
                { path: 'remove', component: FidoRemoveComponent }
            ]
        }
    ]
};



import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    ui: fromUI.State;
    auth: fromAuth.AuthState;
}


export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer,
    auth: fromAuth.authReducer
};

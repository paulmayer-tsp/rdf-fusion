import * as MyTypes from "MyTypes";
import {ILoginInfo, AuthTypes} from 'actions'

const userInfo = localStorage['user_info']

const saveUserInfo = (userInfo: ILoginInfo) => {
    localStorage['user_info'] = JSON.stringify(userInfo)
}

const logout = () => {
    localStorage.clear()
}

const getLocalStorageUserInfo = (): ILoginInfo => {
    let userInfoString = localStorage['user_info']
    let initialState: ILoginInfo = {
        access_token: '',
        expires_in: 0,
        token_type: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        is_candidate: false,
        is_admin: false,
        is_technicien: false,
        is_publique: false,

    }
    if (userInfoString && Boolean(userInfoString) && localStorage['user_info'] !== '') {
        initialState = JSON.parse(userInfoString);
    }
    return initialState;
}

export const initialState: ILoginInfo = getLocalStorageUserInfo();


export const authReducer = (state: ILoginInfo = initialState, action: MyTypes.RootAction) => {
    switch (action.type) {
        case AuthTypes.LOGOUT: {
            logout()
            return {} as ILoginInfo;
        }
        case AuthTypes.LOGIN: {
            saveUserInfo(action.payload)
            return action.payload;
        }
        default:
            return initialState;
    }
};

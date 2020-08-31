import {action} from "typesafe-actions"
import {AuthTypes} from './AuthTypes'

export interface ILoginInfo {
    access_token: string
    expires_in: number
    token_type: string
    username: string
    firstName: string
    lastName: string
    email: string
    is_candidate: boolean
    is_admin: boolean
    is_technicien: boolean
    is_publique: boolean
}

export const authActions = {
    login: (loginInfo: ILoginInfo) => action(AuthTypes.LOGIN, loginInfo),
    logout: () => action(AuthTypes.LOGOUT, {})
};
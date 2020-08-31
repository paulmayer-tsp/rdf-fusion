import BaseService from './BaseService'
import {authUrls} from './urls'
import {ILoginFormValues} from "../pages/auth/login/Login.page";

interface LoginParams {
    email: string,
    password: string,
}

interface SignUpParams {
    email: string,
    password: string,
}

class AuthService {
    static login = (info: ILoginFormValues) => BaseService.postRequest(authUrls.LOGINUSER, info, false);
    static signUp = (info: SignUpParams) => BaseService.postRequest(authUrls.SIGNUP, info, false);
}

export default AuthService;
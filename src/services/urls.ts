export const key = `AIzaSyBGFQFk2CnNJwX8W-xosh5QJRduE3id4l0`;
/*Urls for the application */
// export const prefixer = 'http://10.42.0.5:5600/api/v1/';
// export const prefixer = "http://192.168.137.57:5020/api/";
export const prefixer = "http://192.168.100.27:5020/api/";
// export const prefixer = "http://10.42.0.65:5002/api/";
//export const prefixer = "http://10.42.0.219:5000/api/v1/";
export const google_map_api_key = (address) => {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;
}

export const socketioUrl = 'wss://socketspreprod.clickid.gcloud.bara.ca/';
//export const apiKey = "pk_test_1PiZIwYz4GtUSMn2Df6E9GK1";
export const apiKey = 'pk_test_BaNrkk8vtW8ASINxjqkChRQD';
//export const apiKey = "pk_live_nUTrZubKZrBNO38VQmbm3UxP";

export const authUrls = {
    //Auth URI
    SIGNINUSER: `${prefixer}`,
    LOGINUSER: `${prefixer}authentication/login`,
    LOGOUTUSER: `${prefixer}authentication/logout`,
    RESET_PASSWORD: `${prefixer}authentication/reset-password`,
    SIGNUP: `${prefixer}authentication/signup`,
};

//export const hostIp = '192.168.1.102';
export const hostIp = 'localhost';
export const hostPort = 9002;

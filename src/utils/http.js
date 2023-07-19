import $ from 'jquery'
import store from '@/store'

let base;
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){//如果是开发环境
    base = window.location.protocol + '//' + window.location.hostname;
    console.log(base);
}else{
    base = window.location.protocol + '//' + window.location.hostname + ":" + window.location.port
}
export const postRequest = (url, params, success, error) => {
    return $.ajax({
        url: base + url,
        data: params,
        type: "post",
        headers: {
            Authorization: "Bearer " + store.state.user.jwtToken,
        },
        success,
        error,
    });
}
export const getRequest = (url, params, success, error) => {
    return $.ajax({
        url: base + url,
        data: params,
        type: "get",
        headers: {
            Authorization: "Bearer " + store.state.user.jwtToken,
        },
        success,
        error,
    });
}

export const loginRequest = (url, params, success, error) => {
    return $.ajax({
        url: base + url,
        data: params,
        type: "post",
        success,
        error,
    });
}
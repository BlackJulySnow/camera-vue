import { loginRequest } from '@/utils/http';

export default ({
    state: {
        id: "",
        name: "",
        token: "",
        role: "",
        enable: "",
        is_login: false,
        pulling_info: false, // true
    },
    getters: {},
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.role = user.role;
            state.name = user.name;
            state.is_login = user.is_login;
            state.enable = user.enable;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.name = "";
            state.token = "";
            state.role = "";
            state.enable = "";
            state.is_login = false;
        },
        updatePullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        },
    },
    actions: {
        login(context, data) {
            loginRequest("/user/login", {
                    "id": data.username,
                    "password": data.password,
                },
                function success(resp) {
                    if (resp.code == '200') {
                        localStorage.setItem("data", JSON.stringify(resp.data));
                        context.commit("updateToken", resp.data.jwtToken);
                        context.commit("updateUser", {
                            ...resp.data,
                            is_login: true,
                        });
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                function error(resp) {
                    data.error(resp);
                })
        },
        getinfo(context, resp) {
            let data = JSON.parse(localStorage.getItem("data"));
            context.commit("updateUser", {
                ...data,
                is_login: true,
            })
            resp.success();
        },
        logout(context) {
            context.commit("logout");
            localStorage.removeItem("data");
        },
    },
    modules: {}
})
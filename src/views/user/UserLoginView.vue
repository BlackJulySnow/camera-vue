

<template>
    <div class="row justify-content-md-center" v-if="!$store.state.user.pulling_info" style="width: 100%;">
        <div class="col-sm-4">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title text-center">登录</h4>
                </div>
                <form @submit.prevent="login">
                    <div class="card-body" id="model-body">
                        <div class="form-group" style="margin: 10px auto;">
                            <input v-model="username" type="text" class="form-control" placeholder="工号" autocomplete="off"
                                id="username">
                        </div>
                        <div class="form-group" style="margin: 10px auto;">
                            <input v-model="password" type="password" class="form-control" placeholder="密码"
                                autocomplete="off" id="password">
                        </div>
                    </div>
                    <div class="card-footer">
                        <input type="submit" class="btn btn-primary form-control" value="登录">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref } from 'vue'
import router from '@/router/index'
import { message } from '@/utils/messageBox'

export default {
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        const data = JSON.parse(localStorage.getItem("data"));
        if (data) {
            store.commit("updateToken", data.jwtToken);
            store.dispatch("getinfo", {
                success() {
                    store.commit("updatePullingInfo", false);
                    router.push({ name: 'home' });
                },
            })
        } else {
            store.commit("updatePullingInfo", false);
        }

        const login = () => {
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    message("登录成功", "success");
                    router.push({ name: 'home' });
                },
                error(resp) {
                    message(resp.msg, "warning");
                }
            })
        }

        return {
            username,
            password,
            login,
        }

    }
}
</script>

<style scoped>
input {
    width: 100%;
}

.card {
    margin-top: 40%;
}
</style>
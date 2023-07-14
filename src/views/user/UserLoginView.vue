

<template>
    <el-header></el-header>
    <el-header></el-header>
    <div class="justify-content-md-center mt-8" v-if="!$store.state.user.pulling_info" style="width: 100%;">
        <div class="container right-panel-active" id="container">
            <div class="form-container sign-in-container ">
                <form action="#">
                    <h1>登录</h1>
                    <input type="text" placeholder="账号" v-model="username" />
                    <input type="password" placeholder="密码" v-model="password" />
                    <button @click="login">登录</button>
                </form>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>货查查视频追溯系统</h1>
                    </div>
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
/*@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');*/

* {
    box-sizing: border-box;
}

body {
    background: #f6f5f7;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Montserrat', sans-serif;
    height: 100vh;
    margin: -20px 0 50px;
}

h1 {
    font-weight: bold;
    margin: 0;
}

h2 {
    text-align: center;
}

p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
}

span {
    font-size: 12px;
}

a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
}

button {
    border-radius: 20px;
    border: 1px solid #FF4B2B;
    background-color: #FF4B2B;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
}

button:active {
    transform: scale(0.95);
}

button:focus {
    outline: none;
}

form {
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
}

input {
    width: 100%;
}

.card {
    margin-top: 40%;
}
</style>
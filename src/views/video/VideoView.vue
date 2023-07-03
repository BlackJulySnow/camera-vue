<template>
    <div class="row" style="margin-top:30px; width: 100%;">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="card">
                <div class="card-header text-center">
                    <span>视频预览</span>
                </div>
                <div class="card-body">
                    <videoPlay v-bind="options" @play="onPlay" @pause="onPause">
                        <h1>暂不支持video标签</h1>
                    </videoPlay>
                </div>
            </div>
        </div>
    </div>
    <div class="col-2"></div>
</template>
<script>
import "video.js/dist/video-js.css";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play'

export default {
    components: {
        videoPlay,
    },
    setup() {
        const route = useRoute();
        let path = "http://127.0.0.1/video/stream/" + route.params.id;
        const options = reactive({
            width: "100%", //播放器高度
            height: "100", //播放器高度
            color: "#409eff", //主题色
            muted: false, //静音
            webFullScreen: false,
            src: path,
            speedRate: ["0.5", "1.0", "1.25", "1.5", "2.0"], //播放倍速
            autoPlay: true, //自动播放
            loop: false, //循环播放
            mirror: false, //镜像画面
            ligthOff: false, //关灯模式
            volume: 1, //默认音量大小
            control: true, //是否显示控制
            controlBtns: [
                "audioTrack",
                "quality",
                "speedRate",
                "volume",
                "setting",
                "pip",
                "pageFullScreen",
                "fullScreen",
            ], //显示所有按钮,
        });
        const onPlay = () => {
            console.log('播放')
        }
        const onPause = () => {
            console.log('暂停')
        }

        return {
            options,
            onPlay,
            onPause,
        }
    }
}
</script>

<style scoped></style>
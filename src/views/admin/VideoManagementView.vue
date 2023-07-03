<template>
    <div class="row" style="width:100%; margin-top:30px">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="card">
                <div class="card-header text-center">
                    <h3>视频管理</h3>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-date-picker v-model="startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                                placeholder="开始时间" />
                        </el-col>
                        <el-col :span="6">
                            <el-date-picker v-model="endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                                placeholder="结束时间" />
                        </el-col>
                        <el-col :span="6">
                            <el-select placeholder="视频状态" v-model="state">
                                <el-option v-for="Type in stateType" :key="Type.value" :label="Type.label"
                                    :value="Type.value" />
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-button :icon="Search" circle type="primary" @click="select()" />
                        </el-col>
                    </el-row>
                </div>
                <div class="card-body">
                    <el-table style="width: 100%" height="540" :data="videoList">
                        <el-table-column prop="createTime" label="创建时间" sortable :formatter="timeFormatter" />
                        <el-table-column prop="startTime" label="开始时间" sortable :formatter="timeFormatter" />
                        <el-table-column prop="endTime" label="结束时间" sortable :formatter="timeFormatter" />
                        <el-table-column prop="renderStartTime" label="渲染开始时间" sortable :formatter="timeFormatter" />
                        <el-table-column prop="renderEndTime" label="渲染结束时间" sortable :formatter="timeFormatter" />
                        <el-table-column prop="state" label="视频状态" :formatter="stateFormatter" />
                        <el-table-column align="right" width="120">
                            <template #default="scope">
                                <el-button type="success" :icon="VideoPlay" circle @click="play(scope.row.id)" />

                                <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.row.id)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="card-footer">
                    <el-row justify="center">
                        <el-row justify="center">
                            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
                                :current_page="current_page" :page-sizes="[10, 50, 100]" :page-size="pageSize"
                                @current-change="handleCurrentChange" @size-change="handleSizeChange" />
                        </el-row>
                    </el-row>
                </div>
                <el-dialog title="视频预览" v-model="playDialog" width="50%" height="auto" @close="playDialog = false"
                    align-center>
                    <video controls autoplay ref="dialogVideo">
                        <source :src="'http://127.0.0.1/video/stream/' + video_id" type='video/mp4'>
                        <!--                      <source src="http://127.0.0.1:8083/video/stream/mp4/toystory" type="video/mp4">-->
                    </video>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>

import { postRequest } from '@/utils/http';
import { message } from '@/utils/messageBox';
import { ref } from 'vue';
import { Search, Delete, VideoPlay } from '@element-plus/icons-vue'
import { stateType } from '@/global'

export default {
    setup() {
        let videoList = ref([]);
        let state = ref(-1);
        let startTime = ref('');
        let endTime = ref('');
        let total = ref(0);
        let current_page = ref(1);
        let pageSize = ref(10);
        let sortBy = ref("id");
        let desc = ref(false);
        let video_id = ref('');
        let playDialog = ref(false);

        const select = () => {
            postRequest("/video/select", {
                startTime: startTime.value,
                endTime: endTime.value,
                state: state.value,
                page: current_page.value,
                size: pageSize.value,
                sortBy: sortBy.value,
                desc: desc.value,
            }, function success(resp) {
                if (resp.code == '200') {
                    videoList.value = resp.data.content;
                    total.value = resp.data.totalElements;
                } else {
                    message(resp.msg, 'error');
                }
            }, function error(resp) {
                message(resp.msg, 'error');
            })
        }
        select();

        return {
            videoList,
            startTime,
            endTime,
            total,
            current_page,
            pageSize,
            select,
            Search,
            state,
            stateType,
            Delete,
            playDialog,
            video_id,
            VideoPlay,
        }
    },
    methods: {
        handleSizeChange(size) {
            this.pageSize = size;
            this.select();
        },
        handleCurrentChange(currentPage) {
            this.current_page = currentPage;
            this.select();
        },
        timeFormatter(row, column, cellValue) {
            if (cellValue == null) {
                return '\\';
            } else {
                let format = 'YYYY-mm-dd HH:MM:SS'
                let date = new Date(cellValue);
                const dataItem = {
                    'Y+': date.getFullYear().toString(),
                    'm+': (date.getMonth() + 1).toString(),
                    'd+': date.getDate().toString(),
                    'H+': date.getHours().toString(),
                    'M+': date.getMinutes().toString(),
                    'S+': date.getSeconds().toString(),
                };
                Object.keys(dataItem).forEach((item) => {
                    const ret = new RegExp(`(${item})`).exec(format);
                    if (ret) {
                        format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, '0'));
                    }
                });
                return format
            }
        },
        stateFormatter(row, column, cellValue) {
            if (cellValue == 0) {
                return "正在渲染队列中";
            } else if (cellValue == 1) {
                return "渲染中";
            } else if (cellValue == 2) {
                return "渲染完成";
            } else if (cellValue == 3) {
                return "渲染错误";
            } else if (cellValue == 4) {
                return "渲染结果已被删除";
            }
        },
        handleDelete(id) {
            const that = this;
            postRequest("/video/delete", {
                id: id,
            }, function success(resp) {
                if (resp.code == '200') {
                    that.select();
                    message(resp.msg, 'success');
                } else {
                    message(resp.msg, 'error');
                }
            }, function error(resp) {
                message(resp.msg, 'error');
            })
        },
        play(id) {
            this.video_id = id
            this.playDialog = true;
        }
    },
}
</script>

<style scoped></style>
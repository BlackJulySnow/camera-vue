<template>
    <div class="row" style="width:100%; margin-top:30px">
        <div class="col-1"></div>
        <div class="col-10">
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
                    <el-table style="width: 100%" height="540" :data="videoList" @sort-change="sortChange">
                        <el-table-column label="序号" width="100">
                            <template #default="scope">
                                {{ (current_page - 1) * pageSize + scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable="costom" :formatter="timeFormatter" />
                        <el-table-column prop="startTime" label="开始时间" sortable="costom" :formatter="timeFormatter" />
                        <el-table-column prop="endTime" label="结束时间" sortable="costom" :formatter="timeFormatter" />
                        <el-table-column prop="renderStartTime" label="渲染开始时间" sortable="costom"
                            :formatter="timeFormatter" />
                        <el-table-column prop="renderEndTime" label="渲染结束时间" sortable="costom" :formatter="timeFormatter" />
                        <el-table-column prop="state" label="视频状态" :formatter="stateFormatter" />
                        <el-table-column align="right" >
                            <template #default="scope">

                                <el-button type="danger" @click="handleDelete(scope.row.id)"
                                    v-if="scope.row.state != 4">删除</el-button>
                                <el-button type="danger" @click="handleDelete(scope.row.id)" v-else>彻底删除</el-button>
                              <el-link target="_blank" :href="'/video/stream/' + scope.row.id" :disabled="scope.row.state != 2" :underline="false" style="margin: 0 10px" >
                                <el-button type="success" :disabled="scope.row.state != 2" :icon="Download" circle></el-button></el-link>
                                <el-button type="success" circle :icon="VideoPlay" @click="play(scope.row.id)"
                                    :disabled="scope.row.state != 2" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { postRequest } from '@/utils/http';
import { message } from '@/utils/messageBox';
import { ref } from 'vue';
import { Search, VideoPlay, Download } from '@element-plus/icons-vue'
import { stateType } from '@/global'
import router from '@/router/index'

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
        const sortChange = (column) => {
            const prop = column.prop
            if (prop) {
                if (column.order == 'ascending') {
                    desc.value = false;
                    sortBy.value = prop
                } else if (column.order == 'descending') {
                    desc.value = true;
                    sortBy.value = prop
                } else if (column.order == null) {
                    sortBy.value = 'id'
                    desc.value = false;
                }
                select();
            }
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
            sortChange,
            Search,
            state,
            stateType,
            playDialog,
            VideoPlay,
          Download,
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
            router.push({ name: 'video_view', params: { id: id } });
        },
    },
}
</script>

<style scoped>
.card /deep/ .el-dialog {
    height: 70%;
}

video {
    height: 100%;
    width: 100%;
    object-fit: cover;
}
</style>

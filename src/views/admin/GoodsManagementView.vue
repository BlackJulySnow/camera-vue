<template>
    <div class="row" style="width:100%; margin-top:30px">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="card">
                <div class="card-header text-center">
                    <h3>订单管理</h3>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-date-picker v-model="startTime" type="datetime" placeholder="开始时间"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-col>
                        <el-col :span="8">
                            <el-input placeholder="搜索工位" v-model="stationId" />
                        </el-col>
                        <el-col :span="8">
                            <el-input placeholder="搜索工号" v-model="uid" />
                        </el-col>

                    </el-row>
                    <el-row class="mt-2" :gutter="20">
                        <el-col :span="8">
                            <el-date-picker v-model="endTime" type="datetime" placeholder="结束时间"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-col>
                        <el-col :span="8">
                            <el-input placeholder="搜索订单" v-model="id" />
                        </el-col>
                        <el-col :span="8">
                            <el-button :icon="Search" circle type="primary" @click="select()" />
                        </el-col>
                    </el-row>
                </div>
                <div class="card-body">
                    <el-table style="width: 100%" height="540" :data="goodsList">
                        <el-table-column prop="id" label="订单编号" sortable />
                        <el-table-column prop="scanTime" label="扫描时间" sortable />
                        <el-table-column prop="station['id']" label="工位id" sortable />
                        <el-table-column #default="scope" align="right">
                            <el-button type="info" :icon="CirclePlus" circle @click="render(scope.row.id)" />
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

            </div>
        </div>
    </div>
</template>
<script>

import { postRequest } from '@/utils/http';
import { message } from '@/utils/messageBox';
import { ref } from 'vue';
import { Search, CirclePlus } from '@element-plus/icons-vue'

export default {
    setup() {
        let goodsList = ref([]);
        let id = ref('');
        let startTime = ref('');
        let endTime = ref('');
        let uid = ref('');
        let stationId = ref('');
        let total = ref(0);
        let current_page = ref(1);
        let pageSize = ref(10);
        let sortBy = ref("id");
        let desc = ref(false);


        const select = () => {
            postRequest("/goods/select", {
                id: id.value,
                startTime: startTime.value,
                endTime: endTime.value,
                uid: uid.value,
                stationId: stationId.value,
                page: current_page.value,
                size: pageSize.value,
                sortBy: sortBy.value,
                desc: desc.value,
            }, function success(resp) {
                if (resp.code == '200') {
                    goodsList.value = resp.data.content;
                    total.value = resp.data.totalElements;
                } else {
                    message(resp.msg, 'error');
                }
            }, function error(resp) {
                message(resp.msg, 'error');
            }
            )
        }
        select();

        return {
            goodsList,
            id,
            startTime,
            endTime,
            uid,
            stationId,
            total,
            current_page,
            pageSize,
            select,
            Search,
            CirclePlus,

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
        render(id) {
            postRequest("/video/renderByGoodsIds", {
                goodsIds: id,
            }, function success(resp) {
                if (resp.code == '200') {
                    message(resp.msg, 'success');
                } else {
                    message(resp.msg, 'error');
                }
            }, function error() {
                message('添加渲染队列失败', 'error');
            })
        },

    },
}
</script>

<style scoped></style>
<template>
    <div class="row" style="width:100%; margin-top:30px">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="card">
                <div class="card-header text-center">
                    <h3>用户管理<el-button class="float-end" type="primary" plain @click="addDialog = true">新增</el-button>
                        <el-dialog v-model="addDialog" title="新增" width="30%">
                            <el-form label-position="right" label-width="100px" :model="form" style="max-width: 460px">
                                <el-form-item label="工号">
                                    <el-input v-model="form.id" />
                                </el-form-item>
                                <el-form-item label="姓名">
                                    <el-input v-model="form.name" />
                                </el-form-item>
                                <el-form-item label="密码">
                                    <el-input v-model="form.password" type="password" show-password />
                                </el-form-item>
                                <el-form-item label="是否启用">
                                    <el-switch class="ml-2" v-model="form.enable"
                                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                                </el-form-item>
                                <el-form-item label="权限">
                                    <el-select v-model="form.role" class="m-2" placeholder="Select">
                                        <el-option label="管理员" value="ROLE_ADMIN" />
                                        <el-option label="普通用户" value="ROLE_USER" />
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="addDialog = false">取消</el-button>
                                    <el-button type="primary" @click="addUser()">
                                        增加
                                    </el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </h3>
                </div>
                <div class="card-body">
                    <el-table :data="userList" style="width: 100%" height="540">
                        <el-table-column prop="id" label="工号" sortable />
                        <el-table-column prop="name" label="姓名" sortable />
                        <el-table-column prop="enable" label="是否启用">
                            <template #default="scope">
                                <el-switch class="ml-2" v-model="scope.row.enable" disabled
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="role" label="权限" :formatter="roleFormatter" />
                        <el-table-column>
                            <template #header>
                                <el-input v-model="key" placeholder="姓名关键字" />
                            </template>
                            <template #default="scope">
                                <el-button type="primary" :icon="Edit" circle @click="edit(scope.row)" />
                                <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.row.id)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog v-model="editDialog" title="编辑" width="30%">
                    <el-form label-position="right" label-width="100px" :model="form" style="max-width: 460px">
                        <el-form-item label="工号">
                            <el-input v-model="form.id" disabled />
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" show-password />
                        </el-form-item>
                        <el-form-item label="是否启用">
                            <el-switch class="ml-2" v-model="form.enable"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                        </el-form-item>
                        <el-form-item label="权限">
                            <el-select v-model="form.role" class="m-2" placeholder="Select">
                                <el-option label="管理员" value="ROLE_ADMIN" />
                                <el-option label="普通用户" value="ROLE_USER" />
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="editDialog = false">取消</el-button>
                            <el-button type="primary" @click="editUser()">
                                修改
                            </el-button>
                        </span>
                    </template>
                </el-dialog>

                <div class="card-footer">
                    <el-row justify="center">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total"
                            :current_page="current_page" :page-sizes="[10, 50, 100]" :page-size="pageSize"
                            @current-change="handleCurrentChange" @size-change="handleSizeChange" />
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { postRequest } from '@/utils/http';
import { Delete, Edit } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { message } from '@/utils/messageBox';
import { userRole } from "@/global";

export default {
    setup() {
        const form = reactive({
            id: '',
            name: '',
            role: "ROLE_USER",
            enable: true,
            password: '',
        })
        let total = ref(0);
        let current_page = ref(1);
        let pageSize = ref(10);
        let userList = ref([]);
        let sortBy = ref("id");
        let desc = ref(false);
        let addDialog = ref(false);
        let editDialog = ref(false);
        let key = ref('');

        const select = () => {
            postRequest("/user/select", {
                page: current_page.value,
                size: pageSize.value,
                sortBy: sortBy.value,
                desc: desc.value,
                key: key.value,
            }, function success(resp) {
                if (resp.code == '200') {
                    total.value = resp.data.totalElements;
                    userList.value = resp.data.content;
                } else {
                    message(resp.msg, 'error');
                }
            }, function error() {
                message('查询失败', 'error');
            })
        }

        select();
        return {
            Edit,
            Delete,
            form,
            addDialog,
            userList,
            key,
            total,
            editDialog,
            pageSize,
            current_page,
            userRole,
            select,
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
        handleClose() {
            const that = this;
            that.form.id = '';
            that.form.name = '';
            that.form.role = 'ROLE_USER';
            that.form.enable = true;
            that.form.password = '';
        },
        addUser() {
            const that = this;
            postRequest("/user/register", {
                id: that.form.id,
                name: that.form.name,
                password: that.form.password,
                role: that.form.role,
                enable: that.form.enable,
            }, function success(resp) {
                if (resp.code == '200') {
                    message('添加成功', 'success');
                } else {
                    message(resp.msg, 'warning');
                }
                that.addDialog = false;
                that.select(1, that.key);
            }, function error() {
                message('添加失败', 'error');
            })
        },
        handleDelete(id) {
            const that = this;
            postRequest("/user/delete", {
                id: id,
            }, function success(resp) {
                if (resp.code == '200') {
                    that.select(1, that.key);
                    message('删除成功', 'success');
                }
            }, function error() {
                message('删除失败', 'error');
            })
        },
        editUser() {
            const that = this;
            postRequest("/user/update", {
                id: that.form.id,
                name: that.form.name,
                password: that.form.password,
                role: that.form.role,
                enable: that.form.enable,
            }, function success(resp) {
                if (resp.code == '200') {
                    message('修改成功', 'success');
                } else {
                    message(resp.msg, 'warning');
                }
                that.editDialog = false;
                that.select(1, that.key);
            }, function error() {
                message('修改失败', 'error');
            })
        },
        edit(user) {
            const that = this;
            that.form.id = user.id;
            that.form.name = user.name;
            that.form.role = user.role;
            that.form.enable = user.enable;
            that.form.password = '';
            that.editDialog = true;
        },
        roleFormatter(row, column, cellValue) {
            if (cellValue == 'ROLE_ADMIN') {
                return "管理员";
            } else if (cellValue == 'ROLE_USER') {
                return "普通用户";
            }
        }
    },
    watch: {
        addDialog(newV) {
            if (newV === false) {
                this.handleClose();
            }
        },
        key(newV) {
            const that = this;
            that.select(1, newV);
        },
        editDialog(newV) {
            if (newV === false) {
                this.handleClose();
            }
        },
        pageSize() {
            this.select(1, this.key);
        }
    }
}
</script>

<style scoped></style>
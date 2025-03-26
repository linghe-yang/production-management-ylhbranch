<template>
    <div>
        <el-table :data="tableData" stripe style="width: 80%;text-align: center;" :border="true">
            <el-table-column prop="logo" label="Logo">
                <template slot-scope="scope">
                    <el-image v-show="scope.row.logo != ''" style="width: 100px; height: 100px"
                        :src="bindIcon(scope.row.logo)" fit="fill"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="客户编号">
            </el-table-column>
            <el-table-column prop="name" label="名称">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.id == editId" v-model="scope.row.name"></el-input>
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.id == editId" v-model="scope.row.phone"></el-input>
                    <span v-else>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.id == editId" v-model="scope.row.address"></el-input>
                    <span v-else>{{ scope.row.address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户要求">
                <template slot-scope="scope">
                    <el-button size="default" @click="packClick(scope.row)">包装要求</el-button>
                    <el-button size="default" @click="orderClick(scope.row)">整理要求</el-button>
                    <el-button size="default" @click="direClick(scope.row)">整理方向</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.id != editId" @click="changeClick(scope.row)" size="small">编辑</el-button>
                    <el-button type="warn" v-if="scope.row.id == editId" @click="cancelClick(scope.row)"
                        size="small">取消</el-button>
                    <el-button type="primary" v-if="scope.row.id == editId" @click="saveClick(scope.row)"
                        size="small">保存</el-button>
                    <el-button type="danger" v-if="scope.row.id != editId" @click="delClick(scope.row)"
                        size="small">删除</el-button>
                    <el-button v-if="scope.row.id != editId && scope.row.finish === false" size="mini" type="primary"
                        @click="handleFinish(scope.$index, scope.row)">完成项目</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-drawer :title="drawerTitle" :visible.sync="drawer" direction="rtl" :before-close="handleClose">
            <el-row>
            <el-col :span="12" style="display: inline-flex;">
                输入序号
                <el-input  v-model="order" style="display:inline" > </el-input>
                
            </el-col>
            <el-col :span="20">
                需求内容
                <el-input type="textarea" v-model="newdemand" ></el-input>
                <el-button @click="adddemand"  type="primary">新增需求</el-button>
        </el-col>
      </el-row>
            <el-table :data="drawerTable" stripe :border="true">
                <el-table-column prop="num" label="序号">
                </el-table-column>
                <el-table-column prop="demand" label="要求">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.id == deditId" v-model="scope.row.demand"></el-input>
                        <span v-else>{{ scope.row.demand }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button v-if="scope.row.id != deditId" @click="DchangeClick(scope.row)"
                            size="small">编辑</el-button> -->
                        <el-button type="warn" v-if="scope.row.id == deditId" @click="DcancelClick(scope.row)"
                            size="small">取消</el-button>
                        <el-button type="primary" v-if="scope.row.id == deditId" @click="DsaveClick(scope.row)"
                            size="small">保存</el-button>
                        <el-button type="danger" v-if="scope.row.id != deditId" @click="DdelClick(scope.row)"
                            size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-drawer>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: "Vue-ShowCustomer",
    props: {},
    methods: {
        bindIcon(url) {
            return url
        },
        handleClose(done) {
            this.deditId = '';
            this.drawerTable = [];
            done();
        },
        packClick(row) {
            this.demandId = row.id;
            this.$API.reqGetCustPacReq({ id: this.demandId })
                .then((response) => {
                    this.drawerTable = JSON.parse(JSON.stringify(response.data))
                    this.drawerTitle = "客户" + row.name + "的包装要求"
                    this.demandType = 'pack'
                    this.drawer = true;
                })
        },
        direClick(row) {
            this.demandId = row.id;
            this.$API.reqGetCustDire({ id: this.demandId })
                .then((response) => {
                    this.drawerTable = JSON.parse(JSON.stringify(response.data))
                    this.drawerTitle = "客户" + row.name + "的整理方向"
                    this.demandType = 'dire'
                    this.drawer = true;
                })
        },
        orderClick(row) {
            this.demandId = row.id;
            this.$API.reqGetCustOrderReq({ id: this.demandId })
                .then((response) => {
                    this.drawerTable = JSON.parse(JSON.stringify(response.data))
                    this.drawerTitle = "客户" + row.name + "的整理要求"
                    this.demandType = 'order'
                    this.drawer = true;
                })
        },

        fetchData() {
            this.$API.reqGetAllCustomer()
                .then((response) => {
                    this.$data.tableData = JSON.parse(JSON.stringify(response.data));
                });
        },

        delClick(row) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$API.reqDelCustomer(JSON.parse(JSON.stringify(row)))
                    .then(() => {
                        this.fetchData();
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            this.editId = ''
        },
        cancelClick(row) {
            if (row.id) {
                for (let i in row) {
                    row[i] = this.editData[i]
                }
                this.editId = ''
            } else {
                this.tableData.forEach((item, index) => {
                    if (item.id == '') {
                        this.tableData.splice(index, 1)
                    }
                })
            }
        },
        saveClick(row) {
            this.$confirm('此操作将永久更改信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$API.reqSetCustomer(JSON.parse(JSON.stringify(row)))
                    .then(() => {
                        this.fetchData();
                        this.editId = ''
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消更改'
                });
            });

        },

        changeClick(row) {
            if (this.tableData.some((item) => {
                return item.id == ''
            })) {
                this.$message({
                    message: '请先保存',
                    type: 'warning'
                });
                return
            }
            this.editData = JSON.parse(JSON.stringify(row))    //把当前行数据存一份，取消的时候行数据还原
            this.editId = row.id
        },

        //drawer

        fetchDrawer(row) {
            switch (this.demandType) {
                case ('order'):
                    this.$API.reqGetCustOrderReq(JSON.parse(JSON.stringify({ id: row.id })))
                        .then((response) => {
                            this.drawerTable = JSON.parse(JSON.stringify(response.data));
                        })
                    break;
                case ('dire'):
                    this.$API.reqGetCustDire(JSON.parse(JSON.stringify({ id: row.id })))
                        .then((response) => {
                            this.drawerTable = JSON.parse(JSON.stringify(response.data));

                        })
                    break;
                case ('pack'):
                    this.$API.reqGetCustPacReq(JSON.parse(JSON.stringify({ id: row.id })))
                        .then((response) => {
                            this.drawerTable = JSON.parse(JSON.stringify(response.data));
                        })
                    break;
            }
        },
        adddemand() {

            let req = {
                id: this.demandId,
                num: this.order,
                demand: this.newdemand
            }
            switch (this.demandType) {
                case ('order'):
                    this.$API.reqAddCustOrderReq(JSON.parse(JSON.stringify(req)))
                        .then(() => {
                            this.fetchDrawer({ id: this.demandId })
                        })
                    break;
                case ('dire'):
                    this.$API.reqAddCustDire(JSON.parse(JSON.stringify(req)))
                        .then(() => {
                            this.fetchDrawer({ id: this.demandId })
                        })
                    break;
                case ('pack'):
                    this.$API.reqAddCustPacReq(JSON.parse(JSON.stringify(req)))
                        .then(() => {
                            this.fetchDrawer({ id: this.demandId })
                        })
                    break;
            }
            this.newdemand = ''
            this.order = ''

        },
        DdelClick(row) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                switch (this.demandType) {
                    case ('order'):
                        this.$API.reqDelCustOrderReq(JSON.parse(JSON.stringify({ id: row.id,num:row.num })))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId });
                            })
                        break;
                    case ('dire'):
                        this.$API.reqDelCustDire(JSON.parse(JSON.stringify({ id: row.id,num:row.num  })))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId })
                            })
                        break;
                    case ('pack'):
                        this.$API.reqDelCustPacReq(JSON.parse(JSON.stringify({ id: row.id,num:row.num  })))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId })
                            })
                        break;
                }

            }
            ).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        DcancelClick(row) {
            if (row.id) {
                for (let i in row) {
                    row[i] = this.deditData[i]
                }
                this.deditId = ''
            } else {
                this.drawerTable.forEach((item, index) => {
                    if (item.id == '') {
                        this.drawerTable.splice(index, 1)
                    }
                })
            }
        },
        DsaveClick(row) {
            this.$confirm('此操作将永久更改信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                switch (this.demandType) {
                    case ('order'):
                        this.$API.reqSetCustOrderReq(JSON.parse(JSON.stringify(row)))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId })
                            })
                        break;
                    case ('dire'):
                        this.$API.reqSetCustDire(JSON.parse(JSON.stringify(row)))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId })
                            })
                        break;
                    case ('pack'):
                        this.$API.reqSetCustPacReq(JSON.parse(JSON.stringify(row)))
                            .then(() => {
                                this.fetchDrawer({ id: this.demandId })
                            })
                        break;
                }
                this.deditId = ''
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消更改'
                });
            });

        },
        DchangeClick(row) {
            if (this.drawerTable.some((item) => {
                return item.id == ''
            })) {
                this.$message({
                    message: '请先保存',
                    type: 'warning'
                });
                return
            }
            this.deditData = JSON.parse(JSON.stringify(row))    //把当前行数据存一份，取消的时候行数据还原
            this.deditId = row.id
        },
    },
    data() {
        return {
            order:'',
            newdemand: '',
            demandType: '',
            drawer: false,
            drawerTitle: '',
            drawerTable: [],
            deditData: [],  //编辑行初始数据
            deditId: '',  //判断编辑的是哪一行
            demandId: '',
            editData: [],  //编辑行初始数据
            editId: '',  //判断编辑的是哪一行
            tableData: [],
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        updated: {
            handler(updated) {
                if (updated) {
                    this.fetchData();
                    this.$store.commit("updated", false)
                }
            }
        }
    },
    computed: {
        showTable() {
            return this.filterDataShow.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
        },
        ...mapState({
            updated: (state) => state.module_Base.updated
        })
    }
}

</script>
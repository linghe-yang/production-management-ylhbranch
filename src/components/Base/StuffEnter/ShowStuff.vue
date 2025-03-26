<template>
         <el-card class="box-card" style="width: 80%;">
        <el-col :span="8" style="display: inline-flex">
        <el-input size="medium" v-model="keywords" ref="searchInput" placeholder="按名称搜索"></el-input>
        <el-button @click="clearFilter()" type="primary">清空</el-button>
        </el-col>
    <el-table :data="showTable" stripe style="width: 80%;" :border="true">
        <el-table-column prop="id" label="员工编号">
        </el-table-column>
        <el-table-column prop="name" label="员工姓名">
            <template slot-scope="scope">
                <el-input v-if="scope.row.id == editId" v-model="scope.row.name"></el-input>
                <span v-else>{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="duty" label="员工职务">
        </el-table-column> -->
        <!-- <el-table-column prop="password" label="密码">
        </el-table-column> -->
        <el-table-column prop="phone" label="电话">
            <template slot-scope="scope">
                <el-input v-if="scope.row.id == editId" v-model="scope.row.phone"></el-input>
                <span v-else>{{ scope.row.phone }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="danger" v-if="scope.row.id != editId" @click="delClick(scope.row)"
                    size="small">删除员工</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[3, 5, 15]"
            :page-size="pagesize" :pager-count="7" layout=" prev, pager, next,sizes, jumper" :total="filterDataShow.length">
        </el-pagination>
    </el-card>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: "Vue-ShowStaff",
    props: {},
    methods: {
        searchResource() {
            this.currentPage = 1; //将当前页设置为1，确保每次都是从第一页开始搜
            let filterKeywords = this.keywords.trim();
            let filerReasource = this.tableData.filter(item => {
                if (item.name.includes(filterKeywords)) {
                    return item;
                }
            });
            this.filterDataShow = filerReasource; //将符合条件的内容赋给filterDataShow
        },
        fetchData() {
            this.$API.reqGetAllStaff()
            .then( (response) => {
                    this.$data.tableData = JSON.parse(JSON.stringify(response.data));
                    this.searchResource();
                });
        },
        delClick(row) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$API.reqDelStaff(JSON.parse(JSON.stringify({id:row.id})))
          .then(() =>{
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
          this.$API.reqSetStaff(JSON.parse(JSON.stringify(row)))
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
        handleSizeChange(psize) {
            this.pagesize = psize;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
        },
        clearFilter(){
            this.$data.keywords = ''
        }
    },
    data() {
        return {
            keywords:'',
            filterDataShow: [],
            editData: [],  //编辑行初始数据
            editId: '',  //判断编辑的是哪一行
            tableData: [
            //     {
            //     id: '001',
            //     name: '客户1',
            //     duty:'',
            //     password: '123456',
            //     phone: '18888888888',
            // },
        ],
            pagesize: 5,
            currentPage: 1,
        }
    },
    created() {
        this.fetchData();
    },
    watch: {
        keywords: {
            handler() {
                this.searchResource();
            }
        },
        updated:{
            handler(updated){
                if(updated) {
                    this.fetchData();
                    this.$store.commit("updated",false)
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
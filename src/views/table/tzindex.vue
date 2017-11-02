<template>
  <div class="app-container">
    <div class="filter-container">
    
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="设备编号" v-model="listQuery.bh">
      </el-input>
  <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资产编号" v-model="listQuery.zcbh">
      </el-input>
      <el-select clearable style="width: 130px" class="filter-item" v-model="listQuery.sblb" placeholder="设备类别">
        <el-option v-for="item in sblbOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
   <el-button class="filter-item"  type="primary"  icon="search" @click="handleFilter">搜索</el-button>
   <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
   <el-button class="filter-item" style="margin-left: 10px;" @click="handleUpdatebutton" type="primary" icon="edit">编辑</el-button>
  </div>


    <el-table :data="list" @selection-change="changeFun"
    v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
       
       <el-table-column type="selection"   width="55"> </el-table-column>


      <el-table-column align="center" label='ID' width="95">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="记录状态" width="110">
        <template scope="scope">
          {{scope.row.zt}}
        </template>
      </el-table-column>

      <el-table-column label="设备编号" width="120" align="center">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.bh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编号" width="110" align="center">
        <template scope="scope">
          {{scope.row.zcbh}}
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="110" align="center">
        <template scope="scope">
          {{scope.row.sbmc}}
        </template>
      </el-table-column>
      <el-table-column label="常用名" width="110" align="center">
        <template scope="scope">
          {{scope.row.cym}}
        </template>
      </el-table-column>
      <el-table-column label="设备类别" width="110" align="center">
        <template scope="scope">
          {{scope.row.sblb}}
        </template>
      </el-table-column>
      <el-table-column label="投资计划编码" width="110" align="center">
        <template scope="scope">
          {{scope.row.jhbm}}
        </template>
      </el-table-column>
      <el-table-column label="合同号"  align="center">
        <template scope="scope">
          {{scope.row.hth}}
        </template>
      </el-table-column>
      
    </el-table>


       <!--  <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->


     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
       

        <el-form-item label="记录状态">
          <el-input v-model="temp.zt"></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="temp.bh"></el-input>
        </el-form-item>
        <el-form-item label="资产编号">
          <el-input v-model="temp.zcbh"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="temp.sbmc"></el-input>
        </el-form-item>
        <el-form-item label="常用名">
          <el-input v-model="temp.cym"></el-input>
        </el-form-item>
       <el-form-item label="设备类别">
          <el-select clearable style="width: 130px" class="filter-item" v-model="temp.sblb" placeholder="设备类别">
        <el-option v-for="item in sblbOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
        </el-form-item>
        <el-form-item label="投资计划编码">
          <el-input v-model="temp.jhbm"></el-input>
        </el-form-item>
        <el-form-item label="合同号">
          <el-input v-model="temp.hth"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .link-type {
    color: #337ab7;
    cursor: pointer;
}
</style>


<script>

import { gettzList } from '@/api/table'


export default {
  data() {
    return {
      sblbOptions: ['校直机', 2, 3],
      listQuery: {       
        page: 1,
        limit: 20,
        bh: undefined,
        zcbh: undefined,
        sblb: undefined,
        sort: '+id'
      },
      list: null, 
      list2: null,     
      listLoading: false,
      total: null,
      temp: {
        id: undefined,
        zt:'',
        bh: '',
        zcbh: '',
        sbmc: '',
        cym: '',
        sblb: '',
        jhbm: '',
        hth:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      multipleSelection:[]
    }
  },
  filters: {
   /* statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }*/
   
  },
  created() {
    this.fetchData()
  },
  methods: {
     create() {
      this.temp.id = parseInt(Math.random() * 100) + 1024
      this.list.unshift(this.temp)
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '创建成功',
        type: 'success',
        duration: 2000
      })
    },
     update() {
     //alert('更新');
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v)
          this.list.splice(index, 1, this.temp)
          break
        }
      }
      this.dialogFormVisible = false
      this.$notify({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
     changeFun(val) {
      this.multipleSelection = val;
    },
    handleUpdatebutton() {
      if(this.multipleSelection.length===1){
      this.temp = Object.assign({}, this.multipleSelection.shift())
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      }else{
        alert('请选择一列编辑')
      }  
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        zt:'',
        bh: '',
        zcbh: '',
        sbmc: '',
        cym: '',
        sblb: '',
        jhbm: '',
        hth:''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      gettzList(this.listQuery).then(response => {
       
        this.list = response.data.items
        // this.total = response.data.total
        this.listLoading = false
      })
     
    }
  }
}
</script>

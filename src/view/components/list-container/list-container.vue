<template>
  <div class="list-container" >
    <el-row :gutter="24" class="search">
      <el-col :span="18" >
        <slot name="search"></slot>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="search" v-if="canSearch">搜索</el-button>
        <el-button v-if="createTo && canCreate" type="primary" @click="create">新建</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="table">
      <slot name="table"></slot>
    </el-row>
    <el-row :gutter="24" class="pagination" v-if="pagination.records">
      <el-pagination
        layout="total, prev, pager, next"
        :total="pagination.records"
        :page-size="pagination.max"
        :current-page="pagination.index"
        @current-change="currentChange">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ListContainer',
  props: ['pagination', 'createTo', 'canCreate', 'canSearch'],
  data() {
    return {
    };
  },
  methods: {
    currentChange(page) {
      this.$emit('currentChange', page);
    },
    search() {
      this.$emit('search');
    },
    create() {
      this.$router.push({
        name: this.createTo,
        params: {
          id: 'new',
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-container{
  .search{
    padding-bottom: 20px;
  }
  height: 100%;
  .table{
    padding: 0 20px;
  }
  .pagination{
    text-align: center;
    margin-top: 12px;
  }
  overflow: hidden;
}
</style>


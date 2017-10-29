export default {
  name: 'List',
  data() {
    return {
      query: {},
      loading: false,
      pagination: {
        index: 1,
        max: 10,
        records: 0,
        total: 0,
      },
      data: [],
      sort: {
        prop: 'name',
        order: 'descending',
      },
    };
  },
  computed: {
  },
  methods: {
    search() {
      this.loading = true;
      const query = _.cloneDeep(this.query);
      query.pagination = this.pagination;
      query.sort = this.sort;
      /* eslint-disable */
      query.sort.asc = query.sort.order === 'descending' ? false : true;
      delete query.sort.order;
      this.getData(query)
        .then((res) => {
          this.data = res.data;
          this.pagination = res.pagination;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
    },
    deleteData(item) {
      this.$alert(`确定要删除该${this.name || '数据'}`, {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action === 'confirm') {
            this.handleDlete(item.id)
            .then(() => {
              this.$message({
                showClose: true,
                message: `删除${this.name || '数据'}成功`,
                type: 'success',
              });
              // 重新获取数据
              this.search();
            }, res => {
              console.log(res);
              let mes = `删除${this.name || '数据'}失败, 请重试`;
              if (res && res.data && res.data.message) {
                mes = res.data.message;
              } 
              this.$message.error(mes);
            });
          }
        },
      });
      
    },
    // 页码变化
    currentChange(newV) {
      console.log('hagga');
      this.pagination.index = newV;
      this.search();
    },
    // 排序变化
    sortChange(newV) {
      this.sort.order = newV.order;
      this.sort.prop = newV.prop;
      this.search();
    },
    countMethod(index) {
      return (this.pagination.index - 1) * this.pagination.max + index + 1;
    },
  },
};

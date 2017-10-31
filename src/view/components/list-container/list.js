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
      maxHeight: '560',
    };
  },
  computed: {
  },
  methods: {
    search() {
      this.startLoading();
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
          this.stopLoading();
        }, () => {
          this.stopLoading();
          this.$message.error( `获取${this.name || '数据'}列表失败, 请重试`);
        });
    },
    // ID 是需要操作的 id， actionName 是操作名称， fun 是需要调用的方法
    // type: success / info / warning / error
    action(id, actionName, fun, type='info') {
      if (!id || !actionName || !fun) {
        throw Error('action 参数给定错误');
      }
      this.$alert(`确定要${actionName}该${this.name || '数据'}`, {
        type,
        confirmButtonText: '确定',
        callback: (action) => {
          if (action === 'confirm') {
            fun(id)
              .then(() => {
                this.$message({
                  showClose: true,
                  message: `${actionName}${this.name || '数据'}成功`,
                  type: 'success',
                });
                // 重新获取数据
                this.search();
              }, res => {
                let mes = `${actionName}${this.name || '数据'}失败, 请重试`;
                if (res && res.data && res.data.message) {
                  mes = res.data.message;
                } 
                this.$message.error(mes);
              });
          }
        },
      });
    },
    // 开始计时
    startLoading() {
      // 防止屏幕抖动，一秒之内加载出来的不要 loading
      this.timer = setTimeout(() => {
        this.loading = true;
      }, 1000);
    },
    // 清楚计时
    stopLoading() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.loading = false;
    },
    // 编辑跳转
    edit(name, id) {
      this.$router.push({
        name,
        params: {
          id,
        },
      });
    },
    // 页码变化
    currentChange(newV) {
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

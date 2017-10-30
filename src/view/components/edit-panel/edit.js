export default {
  name: 'Edit',
  data() {
    return {
      id: this.$route.params.id,
      loading: false,
      data: {},
      timer: null,
    };
  },
  computed: {
    title() {
      return this.isNew ? `新增${this.name}` : `编辑${this.name}`;
    },
    isNew() {
      return this.id === 'new';
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.id !== 'new') {
        this.startLoading();
        this.handleDetDetail()
          .then((res) => {
            this.stopLoading();
            this.data = res;
            return res;
          }, (res) => {
            this.stopLoading();
            this.$message.error('获取数据失败, 请重试');
            return res;
          });
      }
    },
    // 开始计时
    startLoading() {
      // 防止屏幕抖动，一秒之内加载出来的不要 loading
      this.timer = setTimeout(() => {
        this.loading = true;
      }, 1000);
    },
    stopLoading() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.loading = false;
    },
    save() {
      this.startLoading();
      this.handleSave()
        .then(() => {
          this.stopLoading();
          this.$message({
            showClose: true,
            message: `${this.isNew ? '新建' : '更新'}${this.name}成功`,
            type: 'success',
          });
        }, () => {
          this.stopLoading();
          this.$message.error(`${this.isNew ? '新建' : '更新'}${this.name}失败, 请重试`);
        });
    },
  },
};

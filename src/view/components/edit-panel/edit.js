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
        this.startLoadingAndTime();
        this.handleDetDetail()
          .then((res) => {
            this.clearTimerAndLoading();
            this.data = res;
            return res;
          }, (res) => {
            this.clearTimerAndLoading();
            this.$message.error('获取数据失败, 请重试');
            return res;
          });
      }
    },
    // 开始计时
    startLoadingAndTime() {
      // 防止屏幕抖动，一秒之内加载出来的不要 loading
      this.timer = setTimeout(() => {
        this.loading = true;
      }, 1000);
    },
    clearTimerAndLoading() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.loading = false;
    },
    save() {
      this.startLoadingAndTime();
      this.handleSave()
        .then(() => {
          this.clearTimerAndLoading();
          this.$message({
            showClose: true,
            message: `${this.isNew ? '新建' : '更新'}${this.name}成功`,
            type: 'success',
          });
        }, () => {
          this.clearTimerAndLoading();
          this.$message.error(`${this.isNew ? '新建' : '更新'}${this.name}失败, 请重试`);
        });
    },
  },
};

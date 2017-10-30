class emplyee {
  constructor(data) {
    this.data = _.cloneDeep(data);
    this.show = _.cloneDeep(data);
    this.init();
  }

  init() {
    this.show.departmentName = _.clone(this.data.department.name);
    this.show.roleName = _.clone(this.data.role.name);
    this.show.originState = this.data.state;
    switch (this.data.state) {
      case 1:
        this.show.state = '可用';
        break;
      case 3:
        this.show.state = '登录锁住';
        break;
      case 5:
        this.show.state = '不可用';
        break;
      default:
        this.show.state = '未知';
    }
  }
}

export default emplyee;

// getters
const getters = {
  // 通过 menu 名字检查菜单是否可用
  checkMenu: state => (menu) => {
    let valid = false;
    state.user.menu.forEach((a) => {
      a.sub_menu.forEach((b) => {
        if (b.link === menu) {
          valid = true;
        }
      });
    });
    return valid;
  },
  // 通过 function 名字 检查功能点是否可用
  checkFun: state => fun => (state.user.functions.filter(item => item.policy === fun).length),
};

export default getters;

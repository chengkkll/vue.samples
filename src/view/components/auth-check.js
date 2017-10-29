export default {
  name: 'AuthCheck',
  data() {
    return {
    };
  },
  methods: {
    checkFun() {
      return true;
      // return this.$store.getters.checkFun(fun);
    },
    checkMenu(menu) {
      return this.$store.getters.checkMenu(menu);
    },
  },
};

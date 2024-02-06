<template>
  <div>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  data() {},
  components: {
    NavBar,
  },
  methods: {
    filterTransactions(userId) {
      this.selectedId = userId;
      const selectedUser = this.users.find((user) => user.userId === userId);
      if (selectedUser.role === "Student") {
        this.newfilteredTransactions = this.transactionDetails.filter(
          (transaction) => {
            return transaction.studentId === userId;
          }
        );
      } else if (selectedUser.role === "Supervisor") {
        this.newfilteredTransactions = this.transactionDetails;
      }
      console.log("filterdTransactionss array", this.newfilteredTransactions);
    },
  },
};
</script>

<style scoped>
html {
  font-family: "Roboto", sans-serif;
}

body {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

div {
  background-color: rgba(239, 245, 245, 255);
  margin-left: -8px;
  margin-right: -8px;
  margin-top: -8px;
  height: 100vh;
}
</style>

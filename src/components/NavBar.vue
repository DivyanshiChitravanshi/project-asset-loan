<template>
  <div class="container">
    <img src="../assets/logo.png" />

    <div class="side">
      <select name="" id="lst" v-model="selectUser">
        <option value="">Select User</option>
        <option v-for="(user, index) in userData" :key="index" :value="user">
          {{ user.firstName }} {{ user.lastName }} ({{ user.role }})
        </option>
      </select>
      <button
        id="btn"
        @click="viewform"
        v-if="selectUser.role === 'Supervisor'"
      >
        Create Transaction
      </button>
    </div>
    <loan-transaction
      v-if="showLoanAssetForm"
      @loanFormSuccess="loadData"
      @cancelForm="closeLoanAssetForm"
      @loanDataFetched="handleLoanDataFetched"
    >
    </loan-transaction>
  </div>
  <div id="filterCard">
    <show-transaction
      @filtered-data="filterTransactions"
      :studentId="selectUser"
    ></show-transaction>
    <div id="card">
      <CardsView
        :isLoanDataFetched="isLoanDataFetched"
        ref="cardsView"
        :studentId="selectUser"
      />
    </div>
  </div>
</template>

<script>
import LoanTransaction from "./LoanTransaction.vue";
import ShowTransaction from "./ShowTransaction.vue";
import CardsView from "./CardsView.vue";
export default {
  components: {
    LoanTransaction,
    CardsView,
    ShowTransaction,
  },
  data() {
    return {
      showLoanAssetForm: false,
      userData: [],
      selectUser: "",
      isLoanDataFetched: false,
      selectedAsset: "",
      selectedUser: "",
      selectedDate: "",
    };
  },

  methods: {
    filterTransactions(filteredData) {
      console.log("xyz:", filteredData);

      this.selectedAsset = filteredData.selectedAsset;
      this.selectedUser = filteredData.selectedUser;

      this.selectedDate = filteredData.selectedDate;
      this.$refs.cardsView.filterTransactions(filteredData);
    },

    handleDataFetched() {
      this.isLoanDataFetched = false;
    },
    handleLoanDataFetched(value) {
      this.isLoanDataFetched = value;
      console.log(this.isLoanDataFetched);
    },

    saveSelectedUser() {
      localStorage.setItem("selectedUser", this.selectUser);
    },
    fetchdata() {
      fetch("http://localhost:3000/users")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.userData = [...data];
          console.log(this.userData);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    },

    viewform() {
      this.showLoanAssetForm = true;
    },

    closeLoanAssetForm() {
      this.showLoanAssetForm = false;
    },
  },

  mounted() {
    this.fetchdata();
  },
};
</script>

<style scoped></style>

<style scoped>
img {
  height: 38px;
  margin: 18px;
  margin-top: 40px;
  margin-left: 60px;
}

.container {
  position: relative;
  display: flex;
  flex-direction: row;
  margin-left: -2px;
  margin-right: -58px;
  height: 95px;
  background-color: rgba(214, 228, 229, 255);
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

#card {
  background-color: rgba(239, 245, 245, 255);
  width: 100%;
  overflow: auto;
}
#lst {
  position: absolute;
  right: 50px;
  margin-top: 20px;
  width: 170px;
  border: none;
  padding: 11px;
  box-shadow: 0 2px 8px rgba(184, 180, 180, 0.952);
  border-radius: 7px;
}
#btn {
  position: absolute;
  right: 240px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(184, 180, 180, 0.952);
  padding: 11px 14px;
  width: 175px;
  text-align: center;
  font-size: 15px;
  background-color: #497173;
  color: white;
  border-radius: 7px;
  border: none;
}
#filterCard {
  height: 91vh;
  overflow: auto;
}
.side {
  margin-top: 15px;
  margin-left: 900px;
}

body {
  background-color: rgba(239, 245, 245, 255);
  overflow-y: hidden;
  font-family: sans-serif;
}
</style>

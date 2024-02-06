<template>
  <div class="filters">
    <div>
      <label for="Asset">Asset</label>
      <div>
        <select id="asset" v-model="selectedAsset" @change="sendFilteredData">
          <option value="">Filter by Asset</option>
          <option v-for="result in results" :key="result.id" :value="result.id">
            {{ result.name }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <label for="User">User</label>
      <div>
        <select id="user" v-model="selectedUser" @change="sendFilteredData">
          <option value="">Filter by User</option>
          <option v-for="user in userss" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <label id="date" for="Date">Date </label>
      <div>
        <div>
          <input
            type="date"
            placeholder="DD/MM/YYYY"
            v-model="selectedDate"
            @change="sendFilteredData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["studentId"],
  data() {
    return {
      results: [],
      userss: [],
      dates: [],
      selectedAsset: "",
      selectedUser: "",
      selectedDate: "",
    };
  },
  watch: {
    studentId(value) {
      console.log("mn", value);
      this.selectedAsset = "";
      this.selectedUser = "";
      this.selectedDate = "";
    },
  },
  methods: {
    fetchData() {
      fetch("http://localhost:3000/assets")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          this.results = data;
          this.results = data.sort((a, b) => a.name.localeCompare(b.name));
          console.log(this.results);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
        });

      fetch("http://localhost:3000/users")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          this.userss = data.filter((users) => users.role === "Student");
        })

        .catch((error) => {
          console.error("Error fetching users:", error);
        });

      fetch("http://localhost:3000/transactions")
        .then((response) => response.json())
        .then((data) => {
          this.transactions = data;
        });
    },
    sendFilteredData() {
      console.log("send");
      this.$emit("filtered-data", {
        selectedAsset: this.selectedAsset,
        selectedUser: this.selectedUser,
        selectedDate: this.selectedDate,
      });
    },
  },
  created() {
    this.fetchData();
    console.log("studentIddata", this.studentId);
  },
};
</script>

<style scoped>
body{
  font-family: "Roboto", sans-serif;
}
.filters {
  justify-content: space-between;
  max-width: 10vw;
  margin-left: 60px;
  align-items: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
}
label {
  display: block;
  margin-bottom: 7px;
  margin-top: 25px;
  padding-left: 10px;
}
.filters select {
  padding: 15px;
  font-size: 14px;
  margin-right: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6.5px -2px #b8bdbe;
  width: 170px;
}
.filters input {
  padding: 13px;
  font-size: 14px;
  margin-right: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6.5px -2px #b8bdbe;
  width: 140px;
}
</style>

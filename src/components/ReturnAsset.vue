<template>
  <div></div>
  <dialog open>
    <div class="form-container">
      <form id="return-asset-form">
        <h2>Return Asset</h2>
        <label for="supervisor">Loaning Supervisor:</label>
        <input
          type="text"
          :value="selectedTransaction.loaningSupervisorname"
          readonly
        />
        <label for="student">Student:</label>
        <input type="text" :value="selectedTransaction.studentname" readonly />
        <label for="asset">Asset:</label>
        <input type="text" :value="selectedTransaction.assetName" readonly />
        <label for="issue-date">Issue Date:</label>
        <input type="text" :value="selectedTransaction.loanDate" readonly />
        />
        <label for="recsupervisor">Receiving Supervisor:</label>
        <select id="recsupervisor" name="recsupervisor" v-model="recsupervisor">
          <option value="">Select</option>
          <option v-for="rec in supervisors" :key="rec.id" :value="rec">
            {{ rec.firstName }} {{ rec.lastName }}
          </option>
        </select>
        <label for="return-date">Return Date:</label>
        <input
          type="date"
          id="return-date"
          name="return-date"
          placeholder="DD/MM/YYYY"
          ref="returnDate"
        />
        <button type="button" id="cancel" @click="cancelreturnForm">
          Cancel
        </button>
        <button type="button" id="save" @click="sendDataToCard">Save</button>
      </form>
    </div>
  </dialog>
</template>
<script>
export default {
  props: ["selectedTransaction"],

  data() {
    return {
      supervisors: [],
      recsupervisor: "",
      loaningSupervisor: "",
    };
  },
  methods: {
    sendDataToCard() {
      const receivingSupervisorname =
        this.recsupervisor.firstName + " " + this.recsupervisor.lastName;
      const returnDate = this.$refs.returnDate.value;
      const transactionId = this.selectedTransaction.id;
      const transactionType = "Return";
      const loaningSupervisorname =
        this.selectedTransaction.loaningSupervisorname;
      const loaningSupervisorId = this.selectedTransaction.loaningSupervisorId;
      const studentId = this.selectedTransaction.studentId;
      const studentname = this.selectedTransaction.studentname;
      const assetId = this.selectedTransaction.assetId;
      const assetName = this.selectedTransaction.assetName;
      const loanDate = this.selectedTransaction.loanDate;
      const requestData = {
        receivingSupervisorname,
        returnDate,
        transactionType,
        loaningSupervisorname,
        loaningSupervisorId,
        studentname,
        studentId,
        assetName,
        assetId,
        loanDate,
      };
      fetch(`http://localhost:3000/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then(() => {
          this.$emit("putSuccess");
          this.$emit("returnAssetSuccess");
          this.cancelreturnForm();
        })

        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },

    fetchdata() {
      fetch("http://localhost:3000/users")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          this.supervisors = data.filter(
            (users) => users.role === "Supervisor"
          );
          console.log("supervisors", this.supervisors);
        })

        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },

    cancelreturnForm() {
      this.$emit("cancelreturnForm");
    },
  },
  created() {
    this.fetchdata();
  },
};
</script>

<style scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(3px);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#return-asset-form {
  margin: -5px -6px 5px 12px;
}
.button-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
.form-container {
  width: 350px;
  border: 2px;
  border: 1px gray;
  box-shadow: 0 2px 8px rgba(184, 180, 180, 0.952);
  height: auto;
  border-radius: 10px;
  margin-top: 200px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px 15px 15px 20px;
  margin-left: 40%;
  background-color: white;
}

label {
  display: block;
  margin-top: 10px;
}

select,
input[type="text"] {
  width: 93%;
  padding: 6px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border-radius: 5px;
}
input[type="date"] {
  width: 93%;
  padding: 6px 12px;
  margin: 8px 0;

  box-sizing: border-box;
  border-radius: 7px;
}

button:hover {
  opacity: 0.8;
  border-radius: 5px;
}

#cancel {
  background-color: white;
  color: black;
  border: 1px solid rgb(20, 15, 15);
  border-radius: 5px;
  padding: 7px;
  text-align: center;
  font-size: 15px;
  width: 150px;
  height: 35px;
}

#save {
  background-color: #4a7274;
  border: 1px solid rgb(20, 15, 15);
  border-radius: 5px;
  margin-left: 15px;
  padding: 7px;
  margin-top: 13px;
  text-align: center;
  font-size: 15px;
  color: white;
  width: 150px;
  height: 35px;
}
</style>

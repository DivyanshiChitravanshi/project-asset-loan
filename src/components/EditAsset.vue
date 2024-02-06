<template>
  <div></div>
  <dialog open>
    <div class="form-container">
      <form id="edit-asset-form">
        <h2>Edit Asset</h2>
        <label for="loaningsupervisorname">Loaning Supervisor:</label>
        <select
          id="loaningSupervisor"
          name="loaningSupervisor"
          v-model="loaningsupervisor"
        >
          <option v-for="sup in supervisors" :key="sup" :value="sup.id">
            {{ sup.firstName }} {{ sup.lastName }}
          </option>
        </select>
        <label for="studentname">Student:</label>
        <select id="studentName" name="studentName" v-model="student">
          <option value="">{{ selectedTransaction.studentname }}</option>
          <option
            v-for="student in students"
            :key="student"
            :value="student.id"
          >
            {{ student.firstName }} {{ student.lastName }}
          </option>
        </select>
        <label for="assetname">Asset:</label>
        <select id="assetname" v-model="asset">
          <option value="">{{ selectedTransaction.assetName }}</option>
          <option v-for="asset in assets" :key="asset" :value="asset.id">
            {{ asset.name }}
          </option>
        </select>
        <label for="issue-date">Issue Date:</label>
        <input
          type="date"
          id="issue-date"
          name="issue-date"
          v-model="loanDate"
        />

        <button type="button" id="cancel" @click="cancelForm">Cancel</button>
        <button type="button" id="save" @click="sendDataToCard">Save</button>
      </form>
    </div>
  </dialog>
</template>
<script>
import mitt from "mitt";
export const eventBus = mitt();
export default {
  props: ["selectedTransaction"],
  data() {
    return {
      students: [],
      assets: [],
      supervisors: [],
      loaningsupervisor: "",
      asset: "",
      student: "",
      loanDate: "",
    };
  },
  emits: ["cancelForm", "putSuccessEdit", "reloadData"],
  methods: {
    sendDataToCard() {
      const supervisor = this.supervisors.find(
        (s) => s.id === this.loaningsupervisor
      );
      const student = this.students.find((s) => s.id === this.student);
      const asset = this.assets.find((a) => a.id === this.asset);
      const updatedTransactionData = {
        loaningSupervisorname: supervisor.firstName + " " + supervisor.lastName,
        loaningSupervisorId: this.loaningsupervisor,
        studentId: this.student,
        studentname: student.firstName + " " + student.lastName,
        assetId: this.asset,
        assetName: asset.name,
        loanDate: this.loanDate,
      };
      const id = this.selectedTransaction.id;
      const transactionType = "Loan";
      const loaningSupervisorname =
        supervisor.firstName + " " + supervisor.lastName;
      const loaningSupervisorId = this.loaningsupervisor;
      const studentId = this.student;
      const studentname = student.firstName + " " + student.lastName;
      const assetId = this.asset;
      const assetName = asset.name;
      const loanDate = this.loanDate;
      const requestData = {
        id,
        transactionType,
        loaningSupervisorname,
        loaningSupervisorId,
        studentname,
        studentId,
        assetName,
        assetId,
        loanDate,
      };
      fetch(`http://localhost:3000/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then(() => {
          eventBus.emit("putSuccessEdit", updatedTransactionData);

          this.$emit("reloadData");
          this.cancelForm();
        })
        .catch((error) => {
          console.error("Error updating transaction:", error);
        });
    },
    fetchData() {
      fetch("http://localhost:3000/assets")
        .then((response) => response.json())
        .then((data) => {
          this.assets = data;
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
        });
      fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((data) => {
          this.students = data.filter((user) => user.role === "Student");
          this.supervisors = data.filter((user) => user.role === "Supervisor");
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    cancelForm() {
      this.$emit("cancelForm");
    },
  },
  created() {
    this.fetchData();
    if (this.selectedTransaction) {
      this.loaningsupervisor = this.selectedTransaction.loaningSupervisorId;
      this.student = this.selectedTransaction.studentId;
      this.asset = this.selectedTransaction.assetId;
    }
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

#edit-asset-form {
  margin: 15px 0px 15px 15px;
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
  margin-top: 350px;
  margin-bottom: 40px;
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

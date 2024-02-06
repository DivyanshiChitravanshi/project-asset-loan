<template>
  <div></div>
  <dialog open>
    <div class="form-container">
      <form id="loan-asset-form">
        <h2>Loan Asset</h2>
        <label for="loaningsupervisor">Loaning Supervisor:</label>
        <select
          id="loaningsupervisor"
          name="loaninsupervisor"
          v-model="loaningsupervisor"
        >
          <option v-for="sup in supervisors" :key="sup.id" :value="sup">
            {{ sup.firstName }} {{ sup.lastName }}
          </option>
        </select>
        <label for="studentname">Student:</label>
        <select id="studentname" name="studentname" v-model="student">
          <option
            v-for="student in students"
            :key="student.id"
            :value="student"
          >
            {{ student.firstName }} {{ student.lastName }}
          </option>
        </select>
        <label for="assetname">Asset:</label>
        <select id="assetname" name="assetname" v-model="assett">
          <option v-for="asset in assets" :key="asset" :value="asset">
            {{ asset.name }}
          </option>
        </select>
        <label for="issue-date">Issue Date:</label>
        <input
          type="date"
          id="issue-date"
          name="issue-date"
          placeholder="DD/MM/YYYY"
          v-model="value.loanDate"
        />
        <button type="button" id="cancel" @click="cancelForm">Cancel</button>
        <button type="button" id="save" @click="saveData">Save</button>
      </form>
    </div>
  </dialog>
</template>

<script>
export default {
  data() {
    return {
      students: [],
      assets: [],
      supervisors: [],
      student: null,
      loaningsupervisor: null,
      assett: null,
      selecteduser: "",
      selectedsupervisor: "",
      selectedasset: "",
      value: {
        transactionId: this.uuidv4(),
        transactionType: "Loan",
        loaningSupervisorId: "",
        loaningsupervisorname: "",
        studentId: "",
        studentname: "",
        assetId: "",
        assetName: "",
        loanDate: "",
        receivingSupervisorId: null,
        receivingSupervisorname: null,
        returnDate: null,
      },
    };
  },
  emits: ["cancelForm", "loanDataFetched"],
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
          this.assets = data;
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
          this.students = data.filter((users) => users.role === "Student");
          this.supervisors = data.filter(
            (users) => users.role === "Supervisor"
          );
          console.log("students", this.students);
          console.log("supervisors", this.supervisors);
        })

        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    saveData() {
      const payload = {
        transactionId: this.value.transactionId,
        transactionType: "Loan",
        loaningSupervisorId: this.loaningsupervisor.id,
        loaningSupervisorname:
          this.loaningsupervisor.firstName +
          " " +
          this.loaningsupervisor.lastName,
        studentId: this.student.id,
        studentname: this.student.firstName + " " + this.student.lastName,
        assetId: this.assett.id,
        assetName: this.assett.name,
        loanDate: this.value.loanDate,

        receivingSupervisorId: this.value.receivingSupervisorId,
        receivingSupervisorname: this.value.receivingSupervisorname,
        returnDate: this.value.returnDate,
      };

      console.log("payload", payload);
      fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          this.$emit("loanDataFetched", true);

          this.cancelForm();
        })
        .catch((error) => {
          console.error("Error updating transaction:", error);
        });
    },

    cancelForm() {
      this.$emit("cancelForm");
    },
  },
  created() {
    this.fetchData();
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
#loan-asset-form {
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
  padding-bottom: 20px;
  padding-top: 20px;
  padding-right: 10px;
  padding-left: 10px;
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

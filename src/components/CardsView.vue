<template>
  <div class="background-container">
    <div v-if="displayedTransactions.length === 0">
      <div id="nodata">
        <img src="../assets/nodata.png" alt="Placeholder Image" />
      </div>
      <div id="headnodata">
        <h1>No Data Available!</h1>
      </div>
    </div>

    <div class="card-container">
      <div
        class="card"
        v-for="trans in displayedTransactions"
        :key="trans.id"
        :class="{
          'orange-dot':
            trans.showDot &&
            !trans.receivingSupervisorname &&
            !trans.returnDate,
          'green-dot':
            trans.showDot &&
            (trans.receivingSupervisorname || trans.returnDate),
          expanded: trans.isExpanded,
          'orange-border':
            trans.isExpanded &&
            !trans.receivingSupervisorname &&
            !trans.returnDate,
          'green-border':
            trans.isExpanded &&
            trans.receivingSupervisorname &&
            trans.returnDate,
        }"
        @click="toggleCard(trans)"
      >
        <div class="content">
          <div class="image-container" v-show="trans.isExpanded">
            <img
              src="../assets/laptopimage.png"
              alt="Laptop"
              class="card-img-top"
            />

            <div
              class="left-icon"
              v-if="
                trans.isExpanded &&
                !trans.receivingSupervisorname &&
                !putSuccess
              "
              @click="view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                width="28"
                viewBox="0 0 512 512"
                class="left-icon"
                v-if="trans.isExpanded"
              >
                <path
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
                  fill="#ea643f"
                />
              </svg>
            </div>
            <div
              class="icon-container"
              v-if="
                trans.isExpanded &&
                !putSuccess &&
                !trans.receivingSupervisorname
              "
              @click="vieweditform(trans)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30"
                width="35"
                viewBox="0 0 400 512"
              >
                <path
                  d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                  stroke="#fff"
                  stroke-width="0.5"
                  fill="#ffffff"
                />
              </svg>
            </div>
          </div>
          <div
            class="icon-container icon2"
            v-if="
              trans.isExpanded && !putSuccess && !trans.receivingSupervisorname
            "
            @click="viewform(trans)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
              width="30"
              viewBox="0 0 384 512"
            >
              <path
                d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"
                fill="#ffffff"
              />
            </svg>
          </div>

          <div class="head">
            <h5>{{ trans.id }}</h5>
            <h1>{{ trans.assetName }}</h1>
            <h4>{{ trans.studentname }}</h4>
          </div>
          <div class="btn" v-show="trans.isExpanded">
            <button>
              <strong>Issue Date:</strong> {{ formatDate(trans.loanDate) }}
            </button>
            <button v-if="putSuccess || trans.returnDate">
              <strong>Return Date:</strong> {{ formatDate(trans.returnDate) }}
            </button>

            <button>
              <strong>Loaning Supervisor:</strong>
              {{ trans.loaningSupervisorname }}
            </button>
            <br />

            <button><strong>Asset ID:</strong>{{ trans.assetId }}</button><br />
            <button><strong>Model:</strong> {{ trans.assetName }}</button><br />
            <button v-if="putSuccess || trans.receivingSupervisorname">
              <strong>Receiving Supervisor:</strong>
              {{ trans.receivingSupervisorname }}
            </button>
            <br />
          </div>
          <div
            class="btn"
            v-if="
              (!trans.isExpanded && trans.receivingSupervisorname) || putSuccess
            "
          >
            <button>
              <strong>Return Date:</strong> {{ formatDate(trans.returnDate) }}
            </button>
            <button>
              <strong>Issue Date:</strong> {{ formatDate(trans.loanDate) }}
            </button>
            <button>
              <strong>Receiving Supervisor:</strong>
              {{ trans.receivingSupervisorname }}
            </button>
          </div>
          <div class="btn" v-else-if="!trans.isExpanded">
            <button>
              <strong>Issue Date:</strong>{{ formatDate(trans.loanDate) }}
            </button>
            <br />
            <button>
              <strong>Loaning Supervisor:</strong>
              {{ trans.loaningSupervisorname }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <return-asset
        v-if="showreturnassetform"
        :selectedTransaction="selectedTransaction"
        @returnAssetSuccess="loadData"
        @cancelreturnForm="closeform"
      >
      </return-asset>
    </div>
    <div>
      <edit-asset
        v-if="showeditassetform"
        :selectedTransaction="selectedTransaction"
        @reloadData="loadData"
        @cancelForm="closeeditform"
      >
      </edit-asset>
    </div>
  </div>
</template>

<script>
import mitt from "mitt";
export const eventBus = mitt();
import ReturnAsset from "./ReturnAsset.vue";
import EditAsset from "./EditAsset.vue";

export default {
  props: ["studentId", "isLoanDataFetched"],
  components: {
    ReturnAsset,
    EditAsset,
  },
  data() {
    return {
      transactions: [],
      showreturnassetform: false,
      showeditassetform: false,
      selectedTransaction: null,
      putSuccess: false,
      putSuccessEdit: false,
      selectedAsset: "",
      selectedUser: "",
      selectedDate: "",
      isExpandedFormOpen: false,
    };
  },
  methods: {
    filterTransactions(filteredData) {
      console.log("xyz:", filteredData);
      this.selectedAsset = filteredData.selectedAsset;
      this.selectedUser = filteredData.selectedUser;
      this.selectedDate = filteredData.selectedDate;
      this.loadData();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
      const formattedWithHyphens = formattedDate.replace(/\//g, "-");
      return formattedWithHyphens;
    },
    vieweditform(transaction) {
      this.showeditassetform = true;
      transaction.isExpanded = !transaction.isExpanded;
      this.selectedTransaction = transaction;
    },
    closeeditform() {
      this.showeditassetform = false;
    },

    viewform(transaction) {
      this.selectedTransaction = transaction;
      transaction.isExpanded = !transaction.isExpanded;
      this.showreturnassetform = true;
    },
    closeform() {
      this.showreturnassetform = false;
    },

    view() {
      alert("Your message");
    },

    loadData() {
      console.log("calledLoadData");
      fetch("http://localhost:3000/transactions")
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.transactions = data.map((trans) => {
            return { ...trans, showDot: true, isExpanded: false };
          });
        });
    },
    toggleCard(trans) {
      trans.isExpanded = !trans.isExpanded;
    },
    updateCardWithEditForm(updatedData) {
      console.log("supervisor", updatedData.loaningSupervisorname);
      if (this.selectedTransaction) {
        this.selectedTransaction.loaningSupervisorname =
          updatedData.loaningSupervisorname;
        this.selectedTransaction.assetName = updatedData.assetName;
        this.selectedTransaction.studentname = updatedData.studentname;
      }
    },
  },
  mounted() {
    this.loadData();
    eventBus.on("putSuccess", () => {
      this.putSuccess = true;
    });
    eventBus.on("returnAssetSuccess", () => {
      this.loadData();
    });
    console.log("studentIDdataincard", this.studentId);

    eventBus.on("putSuccessEdit", (updatedData) => {
      this.putSuccessEdit = true;

      this.updateCardWithEditForm(updatedData);
    });
  },
  watch: {
    studentId(value) {
      console.log("mn", value);
      this.selectedAsset = "";
      this.selectedUser = "";
      this.selectedDate = "";
      this.loadData();
    },
    isLoanDataFetched(newValue) {
      if (newValue) {
        console.log(newValue);
        this.loadData();
      }
    },
  },

  computed: {
    displayedTransactions() {
      console.log(this.studentId);
      let filteredArray = [];
      if (this.studentId.role === "Student") {
        filteredArray = this.transactions.filter(
          (trans) => trans.studentId === this.studentId.id
        );
      } else {
        filteredArray = this.transactions;
      }
      console.log("a:", filteredArray);
      console.log(this.selectedAsset, this.selectedUser);
      if (this.selectedAsset) {
        filteredArray = filteredArray.filter(
          (trans) => trans.assetId === this.selectedAsset
        );
      }
      console.log("b:", filteredArray);

      if (this.selectedUser) {
        filteredArray = filteredArray.filter(
          (trans) => trans.studentId === this.selectedUser
        );
      }
      console.log("c:", filteredArray);

      if (this.selectedDate) {
        const formattedSelectedDate = this.formatDate(this.selectedDate);
        filteredArray = filteredArray.filter(
          (trans) => this.formatDate(trans.loanDate) === formattedSelectedDate
        );
      }
      console.log("d:", filteredArray);
      return filteredArray;
    },
  },
};
</script>

<style scoped>
.card-container {
  columns: 22rem 4;
  column-gap: 20px;
  width: 100%;
  margin-top: 10px;
}
.card-container.expanded-form-open {
  gap: 10px;
  width: 100%;
  margin-top: 0;
}

.card {
  position: relative;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 255);
  text-align: center;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6.5px -2px #838788;
  overflow: hidden;
  transition: height 0.3s ease;
  height: 300px;
  cursor: pointer;
}
.background-container {
  background-color: rgba(239, 245, 245, 255);
  padding: 20px;
  margin-left: 40px;
  margin-right: 23px;
}

.expanded {
  height: auto;
  border-radius: 20px;
}
.orange-dot::before {
  content: "\2022";
  position: absolute;
  top: -30px;
  right: 20px;
  color: rgb(244, 102, 30);
  font-size: 110px;
}
.green-dot::before {
  content: "\2022";
  position: absolute;
  top: -30px;
  right: 20px;
  color: #497173;
  font-size: 110px;
}

.card.expanded {
  height: auto;
  margin-bottom: 40px;
  border-radius: 20px;
}
.card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
}

.trans-id-icon {
  width: 10px;
  height: 30px;
  margin-right: 10px;
}

.card button {
  margin-top: 10px;
  margin-bottom: 4px;
  margin-right: 13px;
  color: black;
  background-color: #f7f7f7;
  border-radius: 9px;
  box-shadow: 0px 1px 4px 1px #b6b8b8;
  height: 35px;
  border: none;
  padding-bottom: 7px;
  padding-top: 7px;
  text-align: center;
}

.card button:hover,
.card button:active {
  opacity: 0.7;
  background-color: rgb(235, 232, 232);
}

.content {
  text-align: left;
  margin-right: 30px;
  width: 100%;
  height: auto;
}

.btn {
  margin-bottom: 30px;
  padding-left: 15px;
  color: #f9f9f9;
  
}

h5 {
  margin-top: 50px;
}

.head {
  padding-left: 15px;
  padding-right: 5px;
}

.icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  border-radius: 80%;
  overflow: hidden;
  background-color: #ea643f;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(194, 91, 91, 0.1);
}

.icon-container.icon2 {
  position: absolute;
  top: 88%;
  right: 10px;
  z-index: 1;
  border-radius: 80%;
  overflow: hidden;
  background-color: #ea643f;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(194, 91, 91, 0.1);
}
.left-icon {
  position: absolute;
  top: 10px;
  left: 8px;
  z-index: 1;
}

.orange-border.card.expanded {
  border-color: #ea643f;
  border-width: 2px;
  border-radius: 18px;
}
.green-border.card.expanded {
  border-color: #497173;
  border-width: 2px;
  border-radius: 18px;
}
#nodata {
  margin-top: -150px;
  text-align: center;
  height: 730px;
}
#headnodata {
  color: #32585a;
  text-align: center;
}
</style>
;

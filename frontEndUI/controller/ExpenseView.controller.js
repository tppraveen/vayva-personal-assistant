
sap.ui.define([
	"frontEndUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"frontEndUI/model/models",
  "sap/m/StandardTile",
  "sap/m/TileContainer"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast,MessageBox, Dialog, Fragment, CMSModel, StandardTile, TileContainer) {
	"use strict";
	let oRouter, oGlobalModel ;


	return BaseController.extend("frontEndUI.controller.ExpenseView", {
		formatter: formatter,
		onInit: function() {
			this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			BusyIndicator.show(0);
			const oRoute = oRouter.getRoute("ExpenseView");
			if (oRoute) {
				oRoute.attachMatched(this.onObjectMatched, this);
			}
 
		},
		onObjectMatched: function() {
			BusyIndicator.hide();
			  oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
				if(oGlobalModel.getProperty("/LoginView/username")===""|| oGlobalModel.getProperty("/LoginView/username")===undefined){
					
					oRouter.navTo("LoginView");
					return
				}
this.fnResetExpenseDetails();
  this.loadExpenseData();
  this.onLoadExpenseSummary();
		},	

		onAfterRendering: function() {
			BusyIndicator.hide();
		},
		onRefreshData: function() {
			this.onObjectMatched();
		},

		onNavBack: function() {
			oRouter.navTo("HomeView", true);
		},
    
    onLoadExpenseSummary: function () {
  const username = oGlobalModel.getProperty("/LoginView/username");
  const oDateRange = this.byId("dateRange");
  const dateRange = oDateRange.getValue(); // e.g., "May 01, 2024 - May 31, 2024"

  let fromDate = null;
  let toDate = null;

  if (dateRange) {
    const parts = dateRange.split(" - ");
    if (parts.length === 2) {
      fromDate = new Date(parts[0]).toISOString(); // e.g., 2024-05-01T00:00:00.000Z
      toDate = new Date(parts[1]).toISOString();
    }
  }

  const payload = {
    username: username,
    fromDate: fromDate,
    toDate: toDate
  };

  const that = this;
  $.ajax({
    url: "/oData/v1/ExpenseServices/getExpenseDashboardSummary",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function (response) {
      if (response.status === "success") {
        const oModel = new sap.ui.model.json.JSONModel(response.data);
        that.getView().setModel(oModel, "oExpenseSummaryModel");
        console.log(response.data)
      } else {
        MessageToast.show("Failed to fetch dashboard data.");
      }
    },
    error: function (xhr, status, error) {
      MessageToast.show("Error filtering expense data.");
      console.error("Filter API error:", error);
    }
  });
},

    onFilter: function () {
  const username = oGlobalModel.getProperty("/LoginView/username");
  const oDateRange = this.byId("dateRange");
  const dateRange = oDateRange.getValue(); // e.g., "May 01, 2024 - May 31, 2024"

  let fromDate = null;
  let toDate = null;

  if (dateRange) {
    const parts = dateRange.split(" - ");
    if (parts.length === 2) {
     // fromDate = new Date(parts[0]).toISOString(); // e.g., 2024-05-01T00:00:00.000Z
      //toDate = new Date(parts[1]).toISOString();
      
var fromDateObj = new Date(parts[0]);
fromDateObj.setDate(fromDateObj.getDate() ); // Add 1 day

var fromDate1 = fromDateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'

var toDateObj = new Date(parts[1]);
toDateObj.setDate(toDateObj.getDate() + 1); // Add 1 day

var toDate1 = toDateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    }
  }
   

  const payload = {
    username: username,
    fromDate: fromDate1,
    toDate: toDate1
  };

  const that = this;
  $.ajax({
    url: "/oData/v1/ExpenseServices/getExpenseListsbyUser",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function (response) {
      if (response.status === "success") {
        var oModel = new sap.ui.model.json.JSONModel(response);
        that.getView().setModel(oModel, "oExpenseModel");
        MessageToast.show("Filtered expense data loaded.");
      } else {
        MessageToast.show("Failed to fetch filtered expense data.");
      }
    },
    error: function (xhr, status, error) {
      MessageToast.show("Error filtering expense data.");
      console.error("Filter API error:", error);
    }
  });
},

 loadExpenseData: function () {
  const username = oGlobalModel.getProperty("/LoginView/username");
  // Get current month range
 const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

const formatDateOnly =  (date) => date.toISOString().split("T")[0];



const fromDate = formatDateOnly(firstDay);
const toDate = formatDateOnly(today);

const oDateRange = this.byId("dateRange");
if (oDateRange) {
  oDateRange.setDateValue(firstDay);
  oDateRange.setSecondDateValue(today);
}

  // Create payload and make API call
  const payload = {
    username: username,
    fromDate: fromDate,
    toDate: toDate
  };
   
 var that=this
       $.ajax({
    url: "/oData/v1/ExpenseServices/getExpenseListsbyUser",
    method: "POST",
  contentType: "application/json",
  data: JSON.stringify(payload),
    success: function (response) {
      if (response.status === "success") {
        var oModel = new sap.ui.model.json.JSONModel(response);
        that.getView().setModel(oModel,"oExpenseModel");
        MessageToast.show("Expense data loaded successfully.");
      } else {
        MessageToast.show("Failed to fetch expense data.");
      }
    },
    error: function (xhr, status, error) {
      MessageToast.show("Error fetching expense data.");
      console.error("API error:", error);
    }
  });
},

    // onFilter: function () {
    //   const oRange = this.byId("dateRange").getDateValue();
    //   MessageToast.show("Filtering by date");
    //   // implement filtering logic
    // },

    onExport: function () {
      MessageToast.show("Export to Excel clicked");
      // add export logic
    },


    onAddCategory: function () { 
			oRouter.navTo("ExpenseCategoryConfig", true);
    },
  












// 
fnResetExpenseDetails: function () {
      const oViewModel = new sap.ui.model.json.JSONModel({
        formData: {
          datetime: new Date().toISOString(),
          type: "Expense",
          payment_mode: "Cash",
          is_planned: true,
          category: "",
          sub_category: "",
          amount: "",
          payment_status: "Paid",
          description: "",
          impact_saving: false,
          cycle: "daily",
          merchant_name: "",
          with_whom: "",
          notes: "",
          expense_mood: "Needed",
          username: oGlobalModel.getProperty("/LoginView/username")
        },
        mode: "Add",
        id:'',
        types: [
          { key: "Expense", text: "Expense" },
          { key: "Income", text: "Income" },
          { key: "Transfer", text: "Transfer" },
          { key: "Loan", text: "Loan" }
        ],
        paymentModes: [
          { key: "Credit Card", text: "Credit Card" },
          { key: "Debit Card", text: "Debit Card" },
          { key: "UPI", text: "UPI" },
          { key: "Cash", text: "Cash" },
          { key: "Wallet", text: "Wallet" },
          { key: "Bank Transfer", text: "Bank Transfer" }
        ],
        paymentStatuses: [
          { key: "Paid", text: "Paid" },
          { key: "Not Paid", text: "Not Paid" }
        ],
        cycles: [
          { key: "Daily", text: "Daily" },
          { key: "Weekly", text: "Weekly" },
          { key: "Monthly", text: "Monthly" }
        ],
        moods: [
          { key: "Needed", text: "🟢 Needed" },
          { key: "Urgent", text: "🔴 Urgent" },
          { key: "Want", text: "🟡 Want" },
          { key: "Fun", text: "🟣 Fun" }
        ]
      });
      this.getView().setModel(oViewModel, "viewModel");

      this._loadCategoryList();
    },
	

    onAddExpense: function () {
this.fnResetExpenseDetails();
		this.openExpenseDialog("Add",null); 
    },
    onEditPress: function (oEvent) {
this.fnResetExpenseDetails();
  const oContext = oEvent.getSource().getBindingContext("oExpenseModel");
  const oData = oContext.getObject();
  const id = oData.id;
    const   username = oGlobalModel.getProperty("/LoginView/username");
  const that = this
   const oModel = this.getView().getModel("viewModel");

      oModel.setProperty("/id", id);
  

  // Call API to fetch full expense data
  $.ajax({
    url: "/oData/v1/ExpenseServices/readExpenseByID",
    method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username, id }),
    success: function (response) {
      if (response.status === "success" && response.data) {
        const expenseData = response.data;

        // Map API response to formData structure
        const mappedData = {
          datetime: new Date(expenseData.transactiontime),
          type: expenseData.type.toLowerCase(), // assuming backend sends "Expense", convert to "expense"
          payment_mode: expenseData.payment_mode,
          is_planned: expenseData.is_planned ,
          category: expenseData.category,
          sub_category: expenseData.subcategory,
          amount: expenseData.amount,
          payment_status: expenseData.payment_status,
          description: expenseData.description,
          impact_saving: expenseData.saving_impact ,
          cycle: expenseData.cycle.toLowerCase(),
          merchant_name: expenseData.merchant_name,
          with_whom: expenseData.with_whom,
          notes: expenseData.notes,
          expense_mood: expenseData.expense_mood.includes("Urgent") ? "Urgent" : "Needed", // simplify if needed
          username: expenseData.username
        };

        // Open the dialog with the mapped data
        that.openExpenseDialog("Edit", mappedData);
      } else {
        MessageToast.show("Failed to fetch expense data.");
      }
    },
    error: function () {
      MessageToast.show("Error while fetching expense data.");
    }
  });
},
 
    

      onDelete: function (oEvent) {

        const that = this;

         const oContext = oEvent.getSource().getBindingContext("oExpenseModel");
  const oData = oContext.getObject();
  const id = oData.id;
    const   username = oGlobalModel.getProperty("/LoginView/username");
 
  
       
        if (!username || !id) {
          MessageBox.error("Missing required information for deletion.");
          return;
        }

        MessageBox.confirm(
          `Are you sure you want to delete category "${oData.category} - ${oData.subcategory}" & Amount = ${oData.amount}?`,
          {
            title: "Confirm Deletion",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // Proceed with AJAX delete call
                $.ajax({
                  url: "/oData/v1/ExpenseServices/deleteExpense", // your actual endpoint
                  method: "DELETE",
                  contentType: "application/json",
                  data: JSON.stringify({
                    username: username,
                    id: id
                  }),
                  success: function (response) {
                    MessageToast.show("Deleted successfully.");
                    that.loadExpenseData?.(); // assuming you have a reload method
                  },
                  error: function (xhr) {
                    const message  = "Unknown error occurred.";
                    if (xhr.status === 409) {
                      MessageBox.warning(message);
                    } else if (xhr.status === 404) {
                      MessageBox.error("Expense  not found.");
                    } else {
                      MessageBox.error("Error: " + message);
                    }
                  }
                });
              }
            }
          }
        );
      },




    openExpenseDialog: function (mode, data) {
		
      const oView = this.getView();
      const oModel = oView.getModel("viewModel");

      oModel.setProperty("/mode", mode);
      oModel.setProperty("/formData", data || {
        datetime: new Date().toISOString(),
        type: "expense",
        payment_mode: "Cash",
        is_planned: false,
        category: "",
        sub_category: "",
        amount: "",
        payment_status: "Paid",
        description: "",
        impact_saving: false,
        cycle: "daily",
        merchant_name: "",
        with_whom: "",
        notes: "",
        expense_mood: "Needed",
        username: oGlobalModel.getProperty("/LoginView/username")
      });

	    

      if (!this.byId("expenseDialog")) {
        if (!this._oAddDialog) {
          this._oAddDialog = sap.ui.xmlfragment("frontEndUI.view.fragment.AddExpense", this);
          oView.addDependent(this._oAddDialog);
        }
		
        // Set dynamic width based on device
        var isPhone = sap.ui.Device.system.phone;
        this._oAddDialog.setContentWidth(isPhone ? "100%" : "70%");
        this._oAddDialog.open();
      } else {
        this.byId("expenseDialog").open();
      }
    },

    onSwitchChange: function (oEvent) {
      const key = oEvent.getSource().data("key");
      const value = oEvent.getParameter("state") ? "Yes" : "No";
      this.getView().getModel("viewModel").setProperty(`/formData/${key}`, value);
    },

    onSaveExpense: function () {
      const oData = this.getView().getModel("viewModel").getProperty("/formData");
 oData.username = oGlobalModel.getProperty("/LoginView/username");

      if (!oData.datetime || !oData.type || !oData.amount || !oData.category || !oData.username) {
        MessageBox.error("Please fill in all required fields.");
        return;
      }
      
       
       const oModel = this.getView().getModel("viewModel");
      var userMode = oModel.getProperty("/mode");

      var sUrl =  "/oData/v1/ExpenseServices/updateExpense/"+oModel.getProperty("/id");
      if(userMode==="Add"){
          sUrl =  "/oData/v1/ExpenseServices/insertExpense";
      }
	 
      $.ajax({
        url: sUrl, // Update with your actual backend route
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(oData),
        success: () => {
          MessageToast.show("Expense saved successfully.");
          this.onDialogClose();
          this.loadExpenseData?.(); // Optional: reload list if available
        },
        error: (err) => {
          MessageBox.error("Failed to save expense.");
        }
      });
    },

    onDialogClose: function () {
      if (this._oAddDialog) {
          this._oAddDialog.close();
        }
    },

    _loadCategoryList: function () {
		
	  let username = oGlobalModel.getProperty("/LoginView/username");
      $.ajax({
        url: "/oData/v1/ExpenseCategoryConfigServices/getCategoryListsByUser",
        method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username}),
        success: (data) => {
          const oCategoryModel = new sap.ui.model.json.JSONModel(data || []);
          this.getView().setModel(oCategoryModel, "categoryModel");
        },
        error: () => {
          MessageBox.error("Failed to load categories.");
        }
      });
    },

    onCategoryChange: function (oEvent) {
		
	  let username = oGlobalModel.getProperty("/LoginView/username");
      const category = oEvent.getParameter("selectedItem").getKey();

      $.ajax({
        url: `/oData/v1/ExpenseCategoryConfigServices/getSubCategoryListsByUser`,
         method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username, category }),
		   success: (data) => {
          const oSubcategoryModel = new sap.ui.model.json.JSONModel(data || []);
          this.getView().setModel(oSubcategoryModel, "subcategoryModel");
        },
        error: () => {
          MessageBox.error("Failed to load subcategories.");
        }
      });
    },



















 
		
	});
});
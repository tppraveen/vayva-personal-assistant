sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageToast',
	"frontEndUI/model/models"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, CMSModel) {
	"use strict";
	var oRouter,oGlobalModel;
	return Controller.extend("frontEndUI.controller.ExpenseCategoryConfig", {
		formatter: formatter,
		onInit: function() {
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ExpenseCategoryConfig").attachMatched(this.onObjectMatched, this);
			this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			// Get Zone list
			//this.getZoneLists();
		},

		onAfterRendering: function() {
		 
		},
		onObjectMatched: function() {
       oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
				if(oGlobalModel.getProperty("/LoginView/username")===""|| oGlobalModel.getProperty("/LoginView/username")===undefined){
					
					oRouter.navTo("LoginView");
					return
				}
      this.loadExpenseCategoryConfigData();
			//Reset Inputs
			// var oprocessComboBox = this.getView().byId("idCMSHome_ProcessSelectInput");
			// if (oprocessComboBox) {
			// 	oprocessComboBox.setSelectedKey("");
			// 	oprocessComboBox.setValue("");
			// }
		},
		
    loadExpenseCategoryConfigData: function () {
 var oModel =new sap.ui.model.json.JSONModel();
      this.getView().setModel(oModel, "oExpCatConfigModel");
       const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this

 $.ajax({
        url: "/oData/v1/ExpenseCategoryConfigServices/getExpenseCategoryConfigListsbyUser",
        method: "POST",
        contentType: "application/json",
  data: JSON.stringify({ username }),
        success: function (oResponse) {
          if (oResponse.status === "success") {
 var oModel =new sap.ui.model.json.JSONModel(oResponse);
      that.getView().setModel(oModel, "oExpCatConfigModel");
          } else {
            MessageToast.show("Failed: " + oResponse.message);
          }
        },
        error: function (xhr, status, error) {
          MessageToast.show("Error fetching data: " + error);
        }
      });

      return
      var oData = {
        categories: [
          { id: "1", name: "Food" },
          { id: "2", name: "Transport" }
        ],
        subcategories: [
          { id: "1", name: "Groceries" },
          { id: "2", name: "Fuel" }
        ],
        expenses: [
          {
            category: "Food",
            subcategory: "Groceries",
            importance: "High",
            limitGoal: "500",
            recurring: "Yes",
            suggestions: "Buy in bulk",
            notes: "Weekly shopping",
            status: "Active",
            createdOn: "2025-05-27"
          }
        ]
      };
      var oModel = new sap.ui.model.json.JSONModel(oData);
      this.getView().setModel(oModel);
    },

    onNavBack: function () {
      // MessageToast.show("Back navigation triggered.");
        oRouter.navTo("ExpenseView");
					return
    },

    onAddPress: function () {
  var oView = this.getView();

  // Create dummy combo model
  var oComboData = {
    importance: [
      { key: "high", text: "High" },
      { key: "medium", text: "Medium" },
      { key: "low", text: "Low" },
      { key: "not_important", text: "Not Important" }
    ],
    status: [
      { key: "Active", text: "Active" },
      { key: "Inactive", text: "Inactive" },
      { key: "Remove", text: "Remove" }
    ],
    recurringType: [
      { key: "daily", text: "Daily" },
      { key: "weekly", text: "Weekly" },
      { key: "monthly", text: "Monthly" },
      { key: "yearly", text: "Yearly" }
    ]
  };

  var oComboModel = new sap.ui.model.json.JSONModel(oComboData);
  oView.setModel(oComboModel, "comboModel");

  if (!this._oAddDialog) {
    this._oAddDialog = sap.ui.xmlfragment("frontEndUI.view.fragment.AddExpenseCategory", this);
    oView.addDependent(this._oAddDialog);
  }
  
  // Set dynamic width based on device
  var isPhone = sap.ui.Device.system.phone;
  this._oAddDialog.setContentWidth(isPhone ? "100%" : "70%");
  this.resetAddEditModel()
  this._oAddDialog.open();
},

onDialogCancel: function () {
  if (this._oAddDialog) {
    this._oAddDialog.close();
  }
},
resetAddEditModel:function(){
 var oLoadModel = new sap.ui.model.json.JSONModel({
  mode: "Add", // or "Edit"
  formData: {
    id: null,
    category: "",
    subcategory: "",
    importance: "",
    yearlimit: 0,
    monthlimit: 0,
    weeklimit: 0,
    dailylimit: 0,
    suggestions: "",
    notes: "",
    recurring: false,
    recurringtype: "",
    recurringevery: 0,
    isreminder: false,
    status: ""
  }
});
this.getView().setModel(oLoadModel, "viewModel");
},
onAddCategoryConfirm: function () {
  const oViewModel = this.getView().getModel("viewModel");
  const oData = oViewModel.getProperty("/formData");
   
oData.username = oGlobalModel.getProperty("/LoginView/username");
  // Validate mandatory fields
  if (!oData.username || !oData.category || !oData.subcategory) {
    MessageBox.error("Please fill all required fields: Username, Category, Subcategory.");
    return;
  }

  $.ajax({
    url: "/oData/v1/ExpenseCategoryConfigServices/insertExpenseCategoryConfig",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      username: oData.username,
      category: oData.category,
      subcategory: oData.subcategory,
      importance: oData.importance,
      yearlimit: oData.yearlimit,
      monthlimit: oData.monthlimit,
      weeklimit: oData.weeklimit,
      dailylimit: oData.dailylimit,
      suggestions: oData.suggestions,
      notes: oData.notes,
      recurring: oData.recurring,
      recurringtype: oData.recurringtype,
      recurringevery: oData.recurringevery,
      isreminder: oData.isreminder,
      status: oData.status,
      created_by: oData.username // Assuming the same user created it
    }),
    success: function (response) {
      if (response.status === "success") {
        MessageToast.show("Expense category added successfully.");
        this._oDialog.close(); // Close dialog after success
        this._refreshTable();  // Refresh table if needed
      } else {
         MessageToast.show("Insert failed: " + response.message);
      }
    }.bind(this),
    error: function (err) {
      MessageToast.show("Server error during creation.");
      console.error("Create error:", err);
    }
  });
}
,

    onEditPress: function (oEvent) {
        this.onAddPress()
  const id = oEvent.getSource().getBindingContext("oExpCatConfigModel").getProperty("id");
  const that = this;

       const username = oGlobalModel.getProperty("/LoginView/username");
  $.ajax({
    url: `/oData/v1/ExpenseCategoryConfigServices/readExpenseCategoryByID`,
    method: "POST",
  contentType: "application/json",
     data: JSON.stringify({ username ,id}),
    success: function (oData) {
      if (oData && oData.status === "success") {
        const formData = oData.data;
        that.getView().getModel("viewModel").setProperty("/mode", "Edit");
        that.getView().getModel("viewModel").setProperty("/formData", formData);
        
  that._oAddDialog.open();
      }
    },
    error: function (err) {
      MessageToast.show("Failed to load category data.");
    }
  });
},
onSubmitCategory: function () {
  const oModel = this.getView().getModel("viewModel");
  const sMode = oModel.getProperty("/mode");

  if (sMode === "Add") {
    this.onAddCategoryConfirm(); // your logic
  } else {
    this.onUpdateCategoryConfirm(); // your logic
  }
},
onUpdateCategoryConfirm: function () {
  const oViewModel = this.getView().getModel("viewModel");
  const oData = oViewModel.getProperty("/formData");

  const username = oGlobalModel.getProperty("/LoginView/username");
  // Validate required fields
  if (!oData.id) {
    MessageBox.error("Missing ID for update.");
    return;
  }

  $.ajax({
    url: "/oData/v1/ExpenseCategoryConfigServices/updateExpenseCategoryConfig",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      category: oData.category,
      subcategory: oData.subcategory,
      importance: oData.importance,
      yearlimit: oData.yearlimit,
      monthlimit: oData.monthlimit,
      weeklimit: oData.weeklimit,
      dailylimit: oData.dailylimit,
      suggestions: oData.suggestions,
      notes: oData.notes,
      recurring: oData.recurring,
      recurringtype: oData.recurringtype,
      recurringevery: oData.recurringevery,
      isreminder: oData.isreminder,
      status: oData.status,
      username: oData.username, 
      id: oData.id
    }),
    success: function (response) {
      if (response.status === "success") {
        MessageToast.show("Expense category updated successfully.");
        this.onDialogCancel(); // Close dialog
        this.loadExpenseCategoryConfigData(); // Optional: refresh your table/list
      } else {
        MessageBox.error("Update failed: " + response.message);
      }
    }.bind(this),
    error: function (err) {
      MessageBox.error("Server error during update.");
      console.error("Update error:", err);
    }
  });
},

    onDeletePress: function (oEvent) {
      MessageToast.show("Delete pressed.");
    }
 

	});
});
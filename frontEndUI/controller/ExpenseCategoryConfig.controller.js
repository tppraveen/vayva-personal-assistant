sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "frontEndUI/model/formatter",
  'sap/ui/core/BusyIndicator',
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/m/MessageToast',
  'sap/m/MessageBox',
  "frontEndUI/model/models"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, MessageBox, CMSModel) {
    "use strict";
    var oRouter, oGlobalModel;
    return Controller.extend("frontEndUI.controller.ExpenseCategoryConfig", {
      formatter: formatter,
      onInit: function () {
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("ExpenseCategoryConfig").attachMatched(this.onObjectMatched, this);
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

        // Get Zone list
        //this.getZoneLists();
      },

      onAfterRendering: function () {

      },
      onObjectMatched: function () {
        oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
        if (oGlobalModel.getProperty("/LoginView/username") === "" || oGlobalModel.getProperty("/LoginView/username") === undefined) {

          oRouter.navTo("LoginView");
          return
        }
        this._loadCategoryList()
        this.loadExpenseCategoryConfigData();
        //Reset Inputs
        // var oprocessComboBox = this.getView().byId("idCMSHome_ProcessSelectInput");
        // if (oprocessComboBox) {
        // 	oprocessComboBox.setSelectedKey("");
        // 	oprocessComboBox.setValue("");
        // }
      },

      loadExpenseCategoryConfigData: function () {
        var oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "oExpCatConfigModel");
        const username = oGlobalModel.getProperty("/LoginView/username");
        var that = this
BusyIndicator.show(0);
        $.ajax({
          url: "/oData/v1/ExpenseCategoryConfigServices/getExpenseCategoryConfigListsbyUser",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username }),
          success: function (oResponse) {
            BusyIndicator.hide();
            if (oResponse.status === "success") {
              var oModel = new sap.ui.model.json.JSONModel(oResponse);
              that.getView().setModel(oModel, "oExpCatConfigModel");
            } else {
              MessageToast.show("Failed: " + oResponse.message);
            }
          },
          error: function (xhr, status, error) {
            BusyIndicator.hide();
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
      resetAddEditModel: function () {
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
        
        //Reset Remainder Model
         this.resetRemainderFragmntModel();
      },
      onAddCategoryConfirm: function () {
        const oViewModel = this.getView().getModel("viewModel");
        const oData = oViewModel.getProperty("/formData");
        var that = this;
        oData.username = oGlobalModel.getProperty("/LoginView/username");
        // Validate mandatory fields
        if (!oData.username || !oData.category || !oData.subcategory) {
          MessageBox.error("Please fill all required fields: Username, Category, Subcategory.");
          return;
        }
 var oRemData =oViewModel.getProperty("/reminderData");
        if(oRemData.is_recurring){
            oRemData.remainder_at =''
          }
          BusyIndicator.show(0);
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
            created_by: oData.username ,// Assuming the same user created it
            remainderData : oRemData

          }),
          success: function (response) {
            BusyIndicator.hide();
            if (response.status === "success") {
              MessageToast.show("Expense category added successfully.");
              this._oAddDialog.close(); // Close dialog after success
              that.loadExpenseCategoryConfigData();  // Refresh table if needed
            } else {
              MessageToast.show("Insert failed: " + response.message);
            }
          }.bind(this),
          error: function (err) {
            BusyIndicator.hide();
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
        BusyIndicator.show(0);
        $.ajax({
          url: `/oData/v1/ExpenseCategoryConfigServices/readExpenseCategoryByID`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username, id }),
          success: function (oData) {
            BusyIndicator.hide();
            if (oData && oData.status === "success") {
              const formData = oData.data;
              that.getView().getModel("viewModel").setProperty("/mode", "Edit");
              that.getView().getModel("viewModel").setProperty("/formData", formData);
              oData.data.reminder.mode =  "Edit";
              oData.data.reminder.visibility=[]
              var reminder = oData.data.reminder;
              reminder.repeat_days = that.makeJsonSelectedItems(reminder.repeat_days);
              reminder.repeat_month = that.makeJsonSelectedItems(reminder.repeat_month);
               
              that.getView().getModel("viewModel").setProperty("/reminderData", oData.data.reminder );

              that._oAddDialog.open();
            }
          },
          error: function (err) {
            BusyIndicator.hide();
            MessageToast.show("Failed to load category data.");
          }
        });
      },
      makeJsonSelectedItems:function(value){
        try {
          let arr = JSON.parse(value); // parse outer string
          value = arr.flatMap(item => {
            try {
              return typeof item === 'string' && item.startsWith('[')
                ? JSON.parse(item).filter(i => typeof i === 'string')
                : item;
            } catch {
              return typeof item === 'string' ? item : [];
            }
          }).filter(i => typeof i === 'string');
        } catch {
         value = [];
        }
        return value;
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
        var that = this;
        const username = oGlobalModel.getProperty("/LoginView/username");
        // Validate required fields
        if (!oData.id) {
          MessageBox.error("Missing ID for update.");
          return;
        }
        var oRemData =oViewModel.getProperty("/reminderData");
        if(oRemData.is_recurring){
            oRemData.remainder_at =''
          }
          BusyIndicator.show(0);
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
            id: oData.id,
            remainderData :oRemData
          }),
          success: function (response) {
            BusyIndicator.hide();
            if (response.status === "success") {
              MessageToast.show("Expense category updated successfully.");
              this.onDialogCancel(); // Close dialog
              that.loadExpenseCategoryConfigData(); // Optional: refresh your table/list
            } else {
              MessageBox.error("Update failed: " + response.message);
            }
          }.bind(this),
          error: function (err) {
            BusyIndicator.hide();
            MessageBox.error("Server error during update.");
            console.error("Update error:", err);
          }
        });
      },

      onDeletePress: function (oEvent) {

        const that = this;

        const oContext = oEvent.getSource().getBindingContext("oExpCatConfigModel");
        const category = oContext.getProperty("category");
        const subcategory = oContext.getProperty("subcategory");
        const username = oGlobalModel.getProperty("/LoginView/username");

        if (!username || !category || !subcategory) {
          MessageBox.error("Missing required information for deletion.");
          return;
        }

        MessageBox.confirm(
          `Are you sure you want to delete category "${category}" and subcategory "${subcategory}"?`,
          {
            title: "Confirm Deletion",
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.OK) {
                // Proceed with AJAX delete call
                BusyIndicator.show(0);
                $.ajax({
                  url: "/oData/v1/ExpenseCategoryConfigServices/delete", // your actual endpoint
                  method: "DELETE",
                  contentType: "application/json",
                  data: JSON.stringify({
                    username: username,
                    category: category,
                    subcategory: subcategory
                  }),
                  success: function (response) {
            BusyIndicator.hide();
                    MessageToast.show("Deleted successfully.");
                    // optionally refresh model or table
                    that.loadExpenseCategoryConfigData(); // assuming you have a reload method
                  },
                  error: function (xhr) {
            BusyIndicator.hide();
                    const res = JSON.parse(xhr.responseText || "{}");
                    const message = res.message || "Unknown error occurred.";
                    if (xhr.status === 409) {
                      MessageBox.warning(message);
                    } else if (xhr.status === 404) {
                      MessageBox.error("Expense category not found.");
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



      resetRemainderFragmntModel: function () {
   const viewModel = this.getView().getModel("viewModel");
    const formData = viewModel.getProperty("/formData");

    const reminderData = {
        mode: "Add",
        title: formData.subcategory,
        description: "",
        is_recurring: false,
        remainder_at: null,
        due_days: "",
        repeat_type: "Daily",
        repeat_days: [], 
        repeat_month: [],
        repeat_day_of_month: 1,
        repeat_time: null,
        start_date: "",
        end_date: "",
        expectedNextReminder: "12 June 2025",
        visibility: {
            recurringFields: false,
            nonRecurringFields: true,
            weeklyFields: false,
            monthlyFields: false,
            yearlyFields: false
        }
    };

    viewModel.setProperty("/reminderData", reminderData);
},


      onOpenReminderFragment: function () {
    const oModel = this.getView().getModel("viewModel");
        var oRem =  oModel.getProperty("/reminderData");
        if(!oRem || oRem.mode!=="Edit"){
          this.resetRemainderFragmntModel();
        }
        else if(oRem && oRem.mode==="Edit"){
          
    oModel.setProperty("/reminderData/recurring", oRem.is_recurring);
    oModel.setProperty("/reminderData/visibility/recurringFields", oRem.is_recurring);
    oModel.setProperty("/reminderData/visibility/nonRecurringFields", !oRem.is_recurring);

           // Hide all repeat subfields
    oModel.setProperty("/reminderData/visibility/weeklyFields", false);
    oModel.setProperty("/reminderData/visibility/monthlyFields", false);
    oModel.setProperty("/reminderData/visibility/yearlyFields", false);

    // Show only selected type
    if (oRem.repeat_type === "Weekly") {
        oModel.setProperty("/reminderData/visibility/weeklyFields", true);
    } else if (oRem.repeat_type === "Monthly") {
        oModel.setProperty("/reminderData/visibility/monthlyFields", true);
    } else if (oRem.repeat_type === "Yearly") {
        oModel.setProperty("/reminderData/visibility/yearlyFields", true);
    }
        }
        else{          
          this.resetRemainderFragmntModel();
        }
          if (!this._reminderDialog) {
              this._reminderDialog = sap.ui.xmlfragment("frontEndUI.view.fragment.ReminderFragment", this);
              this.getView().addDependent(this._reminderDialog);
          }
          this._reminderDialog.open();
      },
     onRecurringSwitchChange: function (oEvent) {
    const bState = oEvent.getParameter("state");
    const oModel = this.getView().getModel("viewModel");

    oModel.setProperty("/reminderData/recurring", bState);
    oModel.setProperty("/reminderData/visibility/recurringFields", bState);
    oModel.setProperty("/reminderData/visibility/nonRecurringFields", !bState);
},

onRepeatTypeChange: function (oEvent) {
    const sKey = oEvent.getSource().getSelectedKey();
    const oModel = this.getView().getModel("viewModel");

    // Hide all repeat subfields
    oModel.setProperty("/reminderData/visibility/weeklyFields", false);
    oModel.setProperty("/reminderData/visibility/monthlyFields", false);
    oModel.setProperty("/reminderData/visibility/yearlyFields", false);

    // Show only selected type
    if (sKey === "Weekly") {
        oModel.setProperty("/reminderData/visibility/weeklyFields", true);
    } else if (sKey === "Monthly") {
        oModel.setProperty("/reminderData/visibility/monthlyFields", true);
    } else if (sKey === "Yearly") {
        oModel.setProperty("/reminderData/visibility/yearlyFields", true);
    }
},

onReminderOk: function () {
    const oReminderData = this.getView().getModel("viewModel").getProperty("/reminderData");
    if(!oReminderData.is_recurring){
      oReminderData.repeat_type=''
    }
    // Optional: Validate or enrich the data
    console.log("Reminder Data Submitted:", oReminderData);

    // // Example: Append to reminder list
    //  const oModel = this.getView().getModel("viewModel");
    //  const aReminders = [];
    //  aReminders.push(oReminderData);
    // oModel.setProperty("/reminderData", aReminders);

    // Close dialog
    if (this._reminderDialog) {
        this._reminderDialog.close();
      }
},
 


onReminderCancel: function () {
      if (this._reminderDialog) {
        this._reminderDialog.close();
      }
       
},



      _loadCategoryList: function () {

        let username = oGlobalModel.getProperty("/LoginView/username");
        BusyIndicator.show(0);
        $.ajax({
          url: "/oData/v1/ExpenseCategoryConfigServices/getCategoryListsByUser",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username }),
          success: (data) => {
            BusyIndicator.hide();
            const oCategoryModel = new sap.ui.model.json.JSONModel(data || []);
            this.getView().setModel(oCategoryModel, "categoryModel");
          },
          error: () => {
            BusyIndicator.hide();
            MessageBox.error("Failed to load categories.");
          }
        });
      },

      onCategoryChange: function (oEvent) {

        let username = oGlobalModel.getProperty("/LoginView/username");
        const category = oEvent.getParameter("selectedItem").getKey();
BusyIndicator.show(0);
        $.ajax({
          url: `/oData/v1/ExpenseCategoryConfigServices/getSubCategoryListsByUser`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({ username, category }),
          success: (data) => {
            BusyIndicator.hide();
            const oSubcategoryModel = new sap.ui.model.json.JSONModel(data || []);
            this.getView().setModel(oSubcategoryModel, "subcategoryModel");
          },
          error: () => {
            BusyIndicator.hide();
            MessageBox.error("Failed to load subcategories.");
          }
        });
      },





    });
  });

sap.ui.define([
	"frontEndUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"frontEndUI/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageToast',
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"frontEndUI/model/models",
  "sap/m/StandardTile",
  "sap/m/TileContainer"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, Dialog, Fragment, CMSModel, StandardTile, TileContainer) {
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

  this.loadExpenseData();
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
 loadExpenseData: function () {
	  const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this
       $.ajax({
    url: "/oData/v1/ExpenseServices/getExpenseListsbyUser",
    method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ username }),
    success: function (response) {
      if (response.status === "success") {
        var oModel = new sap.ui.model.json.JSONModel(response);
        that.getView().setModel(oModel);
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

    onFilter: function () {
      const oRange = this.byId("dateRange").getDateValue();
      MessageToast.show("Filtering by date");
      // implement filtering logic
    },

    onExport: function () {
      MessageToast.show("Export to Excel clicked");
      // add export logic
    },

    onAddExpense: function () {
      MessageToast.show("Add Expense");
    },

    onAddCategory: function () {
      MessageToast.show("Add Category");
    },

    onEdit: function (oEvent) {
      MessageToast.show("Edit clicked");
    },

    onDelete: function (oEvent) {
      MessageToast.show("Delete clicked");
    }

 
		
	});
});

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
  "sap/m/TileContainer",
  "sap/ui/export/Spreadsheet",
"sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/m/Popover",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/ui/model/json/JSONModel",
"sap/ui/core/ResizeHandler",
  "sap/viz/ui5/data/FlattenedDataset"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, MessageBox, Dialog, Fragment, CMSModel, StandardTile, TileContainer,Spreadsheet,
    FeedItem, ChartFormatter, Popover, Label, VBox, JSONModel,ResizeHandler,FlattenedDataset
  ) {
    "use strict";
    let oRouter, oGlobalModel;


    return BaseController.extend("frontEndUI.controller.ExpenseOverview", {
      formatter: formatter,
      onInit: function () {
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        BusyIndicator.show(0);
        const oRoute = oRouter.getRoute("ExpenseOverview");
        if (oRoute) {
          oRoute.attachMatched(this.onObjectMatched, this);
        }

 
      },
      onObjectMatched: function () {
        BusyIndicator.hide();
        oGlobalModel = sap.ui.getCore().getModel("oGlobalModel");
        if (oGlobalModel.getProperty("/LoginView/username") === "" || oGlobalModel.getProperty("/LoginView/username") === undefined) {
          oRouter.navTo("LoginView");
          return
        }

        var oDateRange = this.getView().byId("dateRange");
        var oToday = new Date();
        var oFirstDay = new Date(oToday.getFullYear(), oToday.getMonth(), 1);

        // Set date range value
        oDateRange.setDateValue(oFirstDay);     
        oDateRange.setSecondDateValue(oToday);   
 
        const oModel = new sap.ui.model.json.JSONModel(); 
        this.getView().setModel(oModel, "oExpenseModel");
        
        this.onFilter();
      },

      onAfterRendering: function () {
        BusyIndicator.hide();
      },
      onRefreshData: function () {
        this.onObjectMatched();
      },

      onNavBack: function () {
        oRouter.navTo("HomeView", true);
      },

      onLoadExpenseSummary: function () {
         const username = oGlobalModel.getProperty("/LoginView/username");
        const oDateRange = this.byId("dateRange");

        let oFromDate = oDateRange.getDateValue();
        let oToDate = oDateRange.getSecondDateValue();

        if (!oFromDate || !oToDate) { 
          return;
        }

        // Normalize full day in local time
        oFromDate.setHours(0, 0, 0, 0);
        oToDate.setHours(23, 59, 59, 999);
         

        // Send ISO strings (UTC)
        const payload = {
          username: username,
          fromDate: this._formatDateIST(oFromDate), // e.g. "2025-06-01T00:00:00.000Z"
          toDate: this._formatDateIST(oToDate)     // e.g. "2025-06-02T23:59:59.999Z"
        };

        const that = this;
        BusyIndicator.show(0);
        $.ajax({
          url: "/oData/v1/ExpenseServices/getExpenseDashboardSummary",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
          success: function (response) {
            BusyIndicator.hide();
            if (response.status === "success") {
              const oModel = new sap.ui.model.json.JSONModel(response.data);
              that.getView().setModel(oModel, "oExpenseSummaryModel");
              console.log(response.data)
            } else {
              MessageToast.show("Failed to fetch dashboard data.");
            }
          },
          error: function (xhr, status, error) {
            BusyIndicator.hide();
            MessageToast.show("Error filtering expense data.");
            console.error("Filter API error:", error);
          }
        });
      }, 
      onReset:function(){
        var oDateRange = this.getView().byId("dateRange");
        var oToday = new Date();
        var oFirstDay = new Date(oToday.getFullYear(), oToday.getMonth(), 1);

        // Set date range value
        oDateRange.setDateValue(oFirstDay);     
        oDateRange.setSecondDateValue(oToday); 
        this.onFilter()
      },

_formatDateIST: function(dateObj) {
    return dateObj.toISOString()
    
},
      onFilter: function () {
        this.onLoadExpenseSummary();
        
        const username = oGlobalModel.getProperty("/LoginView/username");
        const oDateRange = this.byId("dateRange");

        let oFromDate = oDateRange.getDateValue();
        let oToDate = oDateRange.getSecondDateValue();
        console.log(oFromDate)
        if (!oFromDate || !oToDate) { 
          return;
        }

        // Normalize full day in local time
        oFromDate.setHours(0, 0, 0, 0);
        oToDate.setHours(23, 59, 59, 999);
         
        console.log(this._formatDateIST(oFromDate)+"-----"+this._formatDateIST(oToDate) )
        // Send ISO strings (UTC)
        const payload = {
          username: username,
          fromDate: this._formatDateIST(oFromDate), // e.g. "2025-06-01T00:00:00.000Z"
          toDate: this._formatDateIST(oToDate)     // e.g. "2025-06-02T23:59:59.999Z"
        };

        const that = this;
        BusyIndicator.show(0);
        $.ajax({
          url: "/oData/v1/ExpenseServices/getExpenseListsbyUser",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(payload),
          success: function (response) {
            BusyIndicator.hide();
            if (response.status === "success") {
              var oModel = new sap.ui.model.json.JSONModel(response);
              that.getView().setModel(oModel, "oExpenseModel");
              that.fnLoadExpenseTrackerChart();
              MessageToast.show("Expense data loaded successfully.");
            } else {
              MessageToast.show("Failed to load Expense data.");
            }
          },
          error: function (xhr, status, error) {
            BusyIndicator.hide();
            MessageToast.show("Error filtering expense data.");
            console.error("Filter API error:", error);
          }
        });
      },
      
      
fnLoadExpenseTrackerChart: function () {
 var oData = this.getView().getModel("oExpenseModel").getData();

  if (!oData || !Array.isArray(oData.data)) {
    console.error("No valid data in oExpenseModel");
    return;
  }

  var expenseList = oData.data;
  this._rawExpenseData = expenseList; // ✅ Store raw for breakdown

  var aggregatedMap = {};

  expenseList.forEach(function (item) {
    var subcat = item.subcategory || "Unknown";
    var mode = item.payment_mode || "Unknown";
    var key = subcat + "|" + mode;
    var amount = parseFloat(item.amount) || 0;

    if (!aggregatedMap[key]) {
      aggregatedMap[key] = {
        subcategory: subcat,
        payment_mode: mode,
        amount: 0
      };
    }
    aggregatedMap[key].amount += amount;
  });

  var aggregatedArray = Object.values(aggregatedMap);

  var oChartModel = new sap.ui.model.json.JSONModel({ aggregatedData: aggregatedArray });
  this.getView().setModel(oChartModel, "ExpensetrackerChart");

   this._originalData = JSON.parse(JSON.stringify(this.getView().getModel("oExpenseModel").getProperty("/data")));

  // Apply initial filter to exclude income
  this._filterIncomeData(false);

  var oVizFrame = this.byId("idVizFrame");
  oVizFrame.attachSelectData(this._onBarClick.bind(this)); // ✅ attach click event
},

onIncomeSwitchChange: function (oEvent) {
    const bIncludeIncome = oEvent.getParameter("state"); // true if switch is ON
    this._filterIncomeData(bIncludeIncome);
},

_filterIncomeData: function (bIncludeIncome) {
    const aAllData = this._originalData || [];
    const aFilteredData = bIncludeIncome
        ? aAllData // Show all
        : aAllData.filter(item => item.type.toLowerCase() !== "income");

    this.getView().getModel("ExpensetrackerChart").setProperty("/aggregatedData", aFilteredData);
},
_onBarClick: function (oEvent) {
  var aData = oEvent.getParameter("data");
  if (!aData || !aData.length || !aData[0].data) {
    return;
  }

  var selectedSubcategory = aData[0].data.Subcategory;

  // Get all raw items from that subcategory
  var aFiltered = this._rawExpenseData.filter(item =>
    item.subcategory === selectedSubcategory
  );

  // Group by payment_mode
  var oGrouped = {};
  var total = 0;

  aFiltered.forEach(function (item) {
    var mode = item.payment_mode || "Unknown";
    if (!oGrouped[mode]) {
      oGrouped[mode] = [];
    }
    oGrouped[mode].push(item);
    total += parseFloat(item.amount || 0);
  });

  // Build popover content
  var aContent = [];

  Object.keys(oGrouped).forEach(function (mode) {
    var modeTotal = oGrouped[mode].reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

    aContent.push(new sap.m.Label({
      text: `${mode} - ₹${modeTotal.toFixed(2)}`,
      design: "Bold"
    }));

    oGrouped[mode].forEach(function (item) {
      aContent.push(new sap.m.Label({
        text: `• ${item.description || "No description"} - ₹${parseFloat(item.amount).toFixed(2)}`
      }));
    });
  });

  

  var oVBox = new sap.m.VBox({ items: aContent });

  if (this._oCustomPopover) {
    this._oCustomPopover.destroy();
  }

  this._oCustomPopover = new sap.m.Popover({
    title: `₹${total.toFixed(2)} : ${selectedSubcategory}`,
    content: [oVBox],
    placement: sap.m.PlacementType.Auto,
    showHeader: true
  });

  var oDomRef = oEvent.getSource().getDomRef();
  this._oCustomPopover.openBy(oDomRef);
}

,
 
 

    });
  });
sap.ui.define([
  "PersonalAssistantUI/controller/BaseController",
  "PersonalAssistantUI/model/formatter",
  'sap/ui/core/BusyIndicator',
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "sap/viz/ui5/controls/common/feeds/FeedItem"

],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, formatter, BusyIndicator,FlattenedDataset, ChartFormatter, Format,FeedItem) {
    "use strict";
    var oRouter,oGlobalModel;
    return BaseController.extend("PersonalAssistantUI.controller.Dashboard", {
      formatter: formatter,
      onInit: function () {
        var oData = {
    values: [
        // January
        { Week: "W1 Jan,25", Income: 100, Expense: 30 },
        { Week: "W2 Jan,25", Income: 120, Expense: 50 },
        { Week: "W3 Jan,25", Income: 150, Expense: 70 },
        { Week: "W4 Jan,25", Income: 170, Expense: 90 },

        // February
        { Week: "W1 Feb,25", Income: 200, Expense: 100 },
        { Week: "W2 Feb,25", Income: 180, Expense: 60 },
        { Week: "W3 Feb,25", Income: 160, Expense: 80 },
        { Week: "W4 Feb,25", Income: 210, Expense: 120 },

        // March
        { Week: "W1 Mar,25", Income: 220, Expense: 110 },
        { Week: "W2 Mar,25", Income: 240, Expense: 130 },
        { Week: "W3 Mar,25", Income: 260, Expense: 150 },
        { Week: "W4 Mar,25", Income: 280, Expense: 170 }
    ]
};


    var oModel = new sap.ui.model.json.JSONModel(oData);
    this.getView().setModel(oModel,"oExpenseOverviewChart");

          var oUpcomingReminders = new sap.ui.model.json.JSONModel({
    reminders: [
        {
            title: "Meeting with Finance Team",
            description: "Discuss Q4 budget allocations",
            datetime: "Tomorrow 10:00 AM",
            unread: true,
            priority: "High",
            authorName: "John Smith",
            authorPicture: "sap-icon://employee"
        },
        {
            title: "Submit Expense Report",
            description: "For January 2025",
            datetime: "Today 5:00 PM",
            unread: false,
            priority: "Medium",
            authorName: "Jane Doe",
            authorPicture: "sap-icon://employee"
        }
    ]
});
this.getView().setModel(oUpcomingReminders, "upcomingReminders");




        oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        this.getView().setModel(this.getOwnerComponent().getModel("oGlobalAIModel"),"oGlobalAIModel");
        oGlobalModel = this.getView().getModel("oGlobalAIModel");
        // if No login details found nav to Home screeen
        if(!oGlobalModel.getProperty("/globalAppConfig/isUserDetailsLoaded")){
         oRouter.navTo("Login")
        }
                this.loadDummySample();
          // this.onLoadChart()
        oRouter.getRoute("Dashboard").attachMatched(this.onObjectMatched, this);
        // Get Zone list 
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("/oData/v1/api/data");
        this.getView().setModel(oModel, "UserModel");
        // Listen for the "requestCompleted" event to access data after loading
        oModel.attachRequestCompleted(function () {
          console.log("Data loaded:", oModel.getData());
          //alert("Data loaded: " + JSON.stringify(oModel.getData()));
        });

        // Optional: handle errors
        oModel.attachRequestFailed(function (oEvent) {
          console.error("Failed to load data:", oEvent);
        });
      
      }, 
      onObjectMatched: function () {
        BusyIndicator.hide();
        sap.ui.getCore().getModel("oGlobalAIModel").setProperty("/menuBar/menuVisible", true);
      },
      loadDummySample:function(){
          var oData = {
    FinanceData: [  
    {
      "__metadata": { "type": "FinanceNamespace.FinanceItem" },
      "Day": "/Date(1730563200000)/",
      "Value": "42000",
      "Title": "Expense",
      "DisplayValue": "42K",
      "Criticality": "Critical",
      "Description": "Total company expenses for Q1",
      "Currency": "USD",
      "ChartTitle": "Expense Overview"
    },
    {
      "__metadata": { "type": "FinanceNamespace.FinanceItem" },
      "Day": "/Date(1733155200000)/",
      "Value": "76000",
      "Title": "Income",
      "DisplayValue": "76K",
      "Criticality": "Positive",
      "Description": "Revenue generated this quarter",
      "Currency": "USD",
      "ChartTitle": "Income Overview"
    },
    {
      "__metadata": { "type": "FinanceNamespace.FinanceItem" },
      "Day": "/Date(1735750800000)/",
      "Value": "25000",
      "Title": "Hospital",
      "DisplayValue": "25K",
      "Criticality": "Negative",
      "Description": "Healthcare-related spending",
      "Currency": "USD",
      "ChartTitle": "Hospital Expenses"
    },
    {
      "__metadata": { "type": "FinanceNamespace.FinanceItem" },
      "Day": "/Date(1738342800000)/",
      "Value": "18000",
      "Title": "Travel",
      "DisplayValue": "18K",
      "Criticality": "Neutral",
      "Description": "Travel and logistics costs",
      "Currency": "USD",
      "ChartTitle": "Travel Expenses"
    },
    {
      "__metadata": { "type": "FinanceNamespace.FinanceItem" },
      "Day": "/Date(1740934800000)/",
      "Value": "53000",
      "Title": "Miscellaneous",
      "DisplayValue": "53K",
      "Criticality": "Neutral",
      "Description": "Other operating expenses",
      "Currency": "USD",
      "ChartTitle": "Miscellaneous Expenses"
    }
  
 ]
  };
  var oModel = new sap.ui.model.json.JSONModel(oData);
    this.getView().setModel(oModel, "SmartChart_Expenses");
      },

      // Example of handling tile press
      onTilePress: function (oEvent) {
        var oTile = oEvent.getSource();
        var sHeader = oTile.getHeader();
        alert("You pressed the " + sHeader + " tile");
      },
      onToggleCarousel: function() {
    var oCarousel = this.byId("idCarousel");
    oCarousel.setVisible(!oCarousel.getVisible());
},
onNotificationPress: function(oEvent) {
    var oItem = oEvent.getSource();
    console.log("Notification pressed:", oItem.getTitle());
},

onCompletePress: function(oEvent) {
    var oItem = oEvent.getSource().getParent();
    console.log("Complete action for:", oItem.getTitle());
},

onIgnorePress: function(oEvent) {
    var oItem = oEvent.getSource().getParent();
    console.log("Ignore action for:", oItem.getTitle());
},

onReschedulePress: function(oEvent) {
    var oItem = oEvent.getSource().getParent();
    console.log("Reschedule action for:", oItem.getTitle());
}

,



    });
  });
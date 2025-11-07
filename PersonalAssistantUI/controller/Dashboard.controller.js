sap.ui.define([
  "PersonalAssistantUI/controller/BaseController",
  "PersonalAssistantUI/model/formatter",
  'sap/ui/core/BusyIndicator',
  "sap/viz/ui5/data/FlattenedDataset",
  "sap/viz/ui5/format/ChartFormatter",
  "sap/viz/ui5/api/env/Format",
  "sap/viz/ui5/controls/common/feeds/FeedItem",
  
    "sap/m/HBox",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/NumericContent"

],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, formatter, BusyIndicator, FlattenedDataset, ChartFormatter, Format, FeedItem, HBox, GenericTile, TileContent, NumericContent) {
    "use strict";
    var oRouter, oGlobalModel;
    return BaseController.extend("PersonalAssistantUI.controller.Dashboard", {
      formatter: formatter,
      onInit: function () {
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        this.getView().setModel(this.getOwnerComponent().getModel("oGlobalAIModel"), "oGlobalAIModel");
        oGlobalModel = this.getView().getModel("oGlobalAIModel");
        // if No login details found nav to Home screeen
        if (!oGlobalModel.getProperty("/ApplicationConfigurations/isUserDetailsLoaded")) {
          oRouter.navTo("Login")
        }

        // this.onLoadChart()
        oRouter.getRoute("Home").attachMatched(this.onObjectMatched, this);
      },
      
      onObjectMatched: function () {
        BusyIndicator.hide();
var oData = {
        tiles: [
            {
                header: "Featured",
                subheader: "Budget insights",
                unit: "USD",
                footer: "Budget Remaining",
                value: 850,
                valueColor: "Neutral",
                indicator: "Down"
            },
            {
                header: "Alerts",
                subheader: "Spending alerts",
                unit: "",
                footer: "Warnings",
                value: 3,
                valueColor: "Critical",
                indicator: "Up"
            },
            {
                header: "Hot News",
                subheader: "Latest expense updates",
                unit: "USD",
                footer: "This Month",
                value: 1200,
                valueColor: "Good",
                indicator: "Up"
            }
            // ... more tiles as needed
        ]
    };

    var oModel = new sap.ui.model.json.JSONModel(oData);
    this.getView().setModel(oModel);
        
         this.fnLoadMonthlyExpenseChartData();
        this.fnLoadUpcomingRemainders();
      },
      
      onToggleCarousel: function () {
        var oCarousel = this.byId("idCarousel");
        oGlobalModel.setProperty("/DashboardPage/FeedsCarouselToogle", !oCarousel.getVisible())
      },
      fnLoadDummyServiceForRef: function () {
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
      fnLoadMonthlyExpenseChartData: function () { 
 
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
        this.getView().setModel(oModel, "oMonthlyExpenseChartData");
      },
      fnLoadUpcomingRemainders: function () {
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
        this.getView().setModel(oUpcomingReminders, "oUpcomingRemindersData");
      }, 
      // Example of handling tile press
      onTilePress: function (oEvent) {
        var oTile = oEvent.getSource();
        var sHeader = oTile.getHeader();
        alert("You pressed the " + sHeader + " tile");
      },
      onNotificationPress: function (oEvent) {
        var oItem = oEvent.getSource();
        console.log("Notification pressed:", oItem.getTitle());
      },

      onCompletePress: function (oEvent) {
        var oItem = oEvent.getSource().getParent();
        console.log("Complete action for:", oItem.getTitle());
      },

      onIgnorePress: function (oEvent) {
        var oItem = oEvent.getSource().getParent();
        console.log("Ignore action for:", oItem.getTitle());
      },

      onReschedulePress: function (oEvent) {
        var oItem = oEvent.getSource().getParent();
        console.log("Reschedule action for:", oItem.getTitle());
      } ,



    });
  });
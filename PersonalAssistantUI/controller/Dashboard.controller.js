sap.ui.define([
  "PersonalAssistantUI/controller/BaseController",
  "sap/ui/core/mvc/Controller",
  "PersonalAssistantUI/model/formatter",
  'sap/ui/core/BusyIndicator',
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/m/MessageToast',
  "PersonalAssistantUI/model/models",
  "sap/ui/model/json/JSONModel"

],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, CMSModel, JSONModel) {
    "use strict";
    var oRouter;
    return BaseController.extend("PersonalAssistantUI.controller.Dashboard", {
      formatter: formatter,
      onInit: function () {
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Dashboard").attachMatched(this.onObjectMatched, this);
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
this.onBaseInit();
        // Get Zone list
        //this.getZoneLists();
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
      
      // Example of handling tile press
      onTilePress: function (oEvent) {
        var oTile = oEvent.getSource();
        var sHeader = oTile.getHeader();
        alert("You pressed the " + sHeader + " tile");
      }


    });
  });
sap.ui.define([
  "PersonalAssistantUI/controller/BaseController",
  "sap/ui/core/mvc/Controller",
  "PersonalAssistantUI/model/formatter",
  'sap/ui/core/BusyIndicator',
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/m/MessageToast',
  "PersonalAssistantUI/model/models"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, CMSModel) {
    "use strict";
    var oRouter;
    return BaseController.extend("PersonalAssistantUI.controller.Dashboard", {
      formatter: formatter,
      onInit: function () {
        oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Dashboard").attachMatched(this.onObjectMatched, this);
        this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

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


    });
  });
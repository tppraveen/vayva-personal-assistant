
sap.ui.define([
	"PersonalAssistantUI/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"PersonalAssistantUI/model/formatter",
	'sap/ui/core/BusyIndicator',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageToast',
	"sap/m/Dialog",
	"sap/ui/core/Fragment",
	"PersonalAssistantUI/model/models",
  "sap/m/StandardTile",
  "sap/m/TileContainer"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(BaseController, Controller, formatter, BusyIndicator, Filter, FilterOperator, MessageToast, Dialog, Fragment, CMSModel, StandardTile, TileContainer) {
	"use strict";
	let oRouter, oGlobalModel ;


	return BaseController.extend("PersonalAssistantUI.controller.Login", {
		formatter: formatter,
		onInit: function() {
			this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			BusyIndicator.show(0);
			const oRoute = oRouter.getRoute("Login");
			if (oRoute) {
				oRoute.attachMatched(this.onObjectMatched, this);
			}
 
		},
		onObjectMatched: function() {
			BusyIndicator.hide();
			sap.ui.getCore().getModel("oGlobalAIModel").setProperty("/menuBar/menuVisible",false);
			 
		},	
		onLoginPress: function () {
			const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Dashboard");
			return
		},
		 
	});
});
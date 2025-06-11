//  ============================================================================*
// * OBJECT             : 	CapacityPlanning Controller			                *
// * DESCRIPTION		 : 	This controller contains all Capacity Planning  functions  *
// * AUTHOR			 : 	Praveen Kumar TP								         *
// * DATE				 : 	10-04-2025										     *
// * CHANGE REQUEST     : 							                             *
// * DEVELOPMENT ID	 : 															 *
// * ============================================================================*
// * CHANGE HISTORY LOG															 *
// *=============================================================================*
// * NO	|	DATE		|	NAME		|	CORRECTION TR	|	CHANGE REFERNCE# *
// *=============================================================================*
// *		| 	            | 		        |					|   		     *
// *=============================================================================*

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


	return BaseController.extend("frontEndUI.controller.HomeView", {
		formatter: formatter,
		onInit: function() {
			this.oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			BusyIndicator.show(0);
			const oRoute = oRouter.getRoute("HomeView");
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

			  this.loadMenuTiles();
		},	

		onAfterRendering: function() {
			BusyIndicator.hide();
		},
		onRefreshData: function() {
			this.onObjectMatched();
		},

		onNavBack: function() {
			oRouter.navTo("RouteHomeView", true);
		},

    loadMenuTiles: function () {
			BusyIndicator.show(0);
      const oView = this.getView();
      const oContainer = oView.byId("menuTileContainer");
	  const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this
       $.ajax({
         url: "/oData/v1/UserServices/getLoginUserMenu",
  method: "POST",
  contentType: "application/json",
  data: JSON.stringify({ username }),
        success: function (aData) {
          if (!Array.isArray(aData.data)) {
            MessageToast.show("Menu data format invalid");
            return;
          }

           oContainer.removeAllItems()
          aData.data.forEach(function (oItem) {
            const oTile = new StandardTile({
              title: oItem.label,
              info: oItem.menu,
              icon: "sap-icon://action", // Change icon based on oItem.menu if needed
              press: function () {
                oRouter.navTo(oItem.path); // Ensure route is configured
              }.bind(this)
            });
            oContainer.addItem(oTile);
			BusyIndicator.hide();
          }.bind(this));
		  	BusyIndicator.hide(0);
        }.bind(this),
        error: function () {
          MessageToast.show("Failed to load menu items.");
        }
      });
    },
	fnRunremainderScheduler: function () {
      const oView = this.getView(); 
	  BusyIndicator.show(0);
	  const username = oGlobalModel.getProperty("/LoginView/username");
 var that=this
       $.ajax({
         url: "/oData/v1/UserServices/remainderScheduler",
		method: "POST",
		contentType: "application/json",
		data: JSON.stringify({ username }),
        success: function (aData) {
			MessageToast.show(aData.message);
			BusyIndicator.hide();

        }.bind(this),
        error: function () {
			BusyIndicator.hide();
          MessageToast.show("Failed to load menu items.");
        }
      });
    },
 
		
	});
});